const Account = require('../models/account')
const ResetPasswordToken = require('../models/reset-password-token')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const passport = require('passport')
const moment = require('moment')
const GoogleStrategy = require('passport-google-oauth20').Strategy
require('dotenv').config()

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/account/auth/google/callback'
}, (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile)
}))

module.exports = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body
            const data = await Account.findOne({ username: username })
            if (data) {
                const compare = bcrypt.compareSync(password, data.password)
                if (compare) {
                    const token = jwt.sign(
                        {
                            username: data.username,
                            email: data.email,
                            role: data.role
                        },
                        process.env.PRIVATE_KEY,
                        { expiresIn: "1h" })
                    res.status(200).send({
                        message: "Đăng nhập thành công",
                        token: token
                    })
                } else {
                    res.status(500).send({ message: "Sai thông tin tài khoản/mật khẩu" })
                }
            }
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Sai thông tin tài khoản/mật khẩu" })
        }
    },
    loginWithGoogle: async (req, res) => {
        try {
            passport.authenticate('google', { scope: ['profile', 'email'] })(req, res)
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Lỗi đăng nhập bằng Google" });
        }
    },
    loginWithGoogleCallback: async (req, res) => {
        try {
            passport.authenticate('google', (err, user, info) => {
                if (err) return res.status(500).send(err)
                if (!user) {
                    res.status(500).send({ message: "Lỗi đăng nhập bằng Google" });
                } else {
                    const token = jwt.sign({
                        id: user.id,
                        name: user.displayName,
                        email: user.emails[0].value
                    }, process.env.PRIVATE_KEY, { expiresIn: '1h' })
                    res.status(200).send({ message: "Đăng nhập thành công bằng Google", token: token })
                }
            })(req, res)
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Lỗi đăng nhập bằng Google" });
        }
    },
    register: async (req, res) => {
        try {
            const { email, username, password, confirmPassword } = req.body
            if (password !== confirmPassword) {
                return res.status(400).send({ message: "Hai mật khẩu không khớp" })
            }
            const isUsernameExist = await Account.findOne({ username: username })
            if (isUsernameExist) {
                return res.status(400).send({ message: "Username đã tồn tại" })
            } else {
                const isEmailExist = await Account.findOne({ email: email })
                if (isEmailExist) {
                    return res.status(400).send({ message: "Email đã tồn tại" })
                } else {
                    const hashPassword = bcrypt.hashSync(password, 10)
                    const newUser = new Account({
                        email: email,
                        username: username,
                        password: hashPassword
                    })
                    await newUser.save()
                    res.status(200).send({ messgae: 'Tạo tài khoản thành công' })
                }
            }

        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Server Internal Error" })
        }
    },
    updateAccount: async (req, res) => {
        try {
            const { name, bio } = req.body;
            const username = req.params.username
            const account = await Account.findOne({ username: username });
            if (!account) {
                return res.status(404).send({ message: "Tài khoản không tồn tại" });
            }
            const avatar = req.file ? req.file.path : account.avatar; // Nếu có tệp tin hình ảnh tải lên thì sử dụng đường dẫn tạm thời của nó, nếu không thì sử dụng đường dẫn avatar hiện tại
            const updateAccount = await Account.findOneAndUpdate(
                { username: username },
                { name: name, bio: bio, avatar: avatar },
                { new: true }
            );
            res.status(200).send(updateAccount);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { emailOrUsername } = req.body;

            // Tìm người dùng trong database bằng email hoặc username
            const user = await Account.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            // Tạo một mã reset password token ngẫu nhiên
            const token = bcrypt.hashSync(Date.now().toString(), bcrypt.genSaltSync(10));

            // Lưu token vào database với thông tin người dùng và thời gian hết hạn
            const expires = moment().add(1, 'hours');
            const resetPasswordToken = new ResetPasswordToken({
                username: user.username,
                token: token,
                expires: expires.toDate()
            });
            await resetPasswordToken.save();

            // Gửi email chứa đường dẫn reset password tới email của người dùng hoặc email được liên kết với username
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email || '',
                subject: 'Reset Password',
                text: `Hi ${user.username},\n\nPlease click on the following link to reset your password:\n\n${process.env.FRONTEND_URL}/reset-password/${token}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Internal server error' });
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.status(200).json({ message: 'Reset password email has been sent' });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    resetPasswordToken: async (req, res) => {
        try {
            const { password } = req.body;
            const { token } = req.params;

            // Kiểm tra xem token có hợp lệ hay không
            const resetPasswordToken = await ResetPasswordToken.findOne({ token: token });
            if (!resetPasswordToken) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            // Kiểm tra xem token đã hết hạn hay chưa
            const now = moment();
            const expires = moment(resetPasswordToken.expires);
            if (now.isAfter(expires)) {
                await resetPasswordToken.deleteOne();
                return res.status(400).json({ message: 'Token has expired' });
            }

            // Cập nhật mật khẩu của người dùng
            const user = await Account.findOne(resetPasswordToken.username);
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            user.password = bcrypt.hashSync(password, 10);
            await user.save();

            // Xóa token khỏi database
            await resetPasswordToken.deleteOne();

            return res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }

    }


}