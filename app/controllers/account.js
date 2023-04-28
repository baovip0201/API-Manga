const Account = require('../models/account')
const ResetPasswordToken = require('../models/reset-password-token')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const passport = require('passport')
const moment = require('moment')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const cloudinary = require('cloudinary').v2
require('dotenv').config()
const path = require('path')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/account/auth/google/callback'
}, (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile)
}))

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

module.exports = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body
            const data = await Account.findOne({ username: username })
            if (data) {
                const compare = bcrypt.compareSync(password, data.password)
                if (compare) {
                    const accessToken = jwt.sign(
                        {
                            userId: data._id,
                            role: data.role
                        },
                        process.env.PRIVATE_KEY,
                        { expiresIn: "7d" })
                    const refreshToken = jwt.sign({
                        userId: data._id,
                        role: data.role
                    }, process.env.PRIVATE_KEY)

                    const hashRefreshToken = bcrypt.hashSync(refreshToken, 10)

                    data.refreshToken = hashRefreshToken
                    await data.save()

                    res.cookie('refreshToken', refreshToken, { httpOnly: true })

                    res.status(200).send({
                        message: "Đăng nhập thành công",
                        accessToken: accessToken
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
    refreshToken: async (req, res) => {
        const { refreshToken } = req.cookies;

        try {
            if (!refreshToken) {
                return res.status(401).json({ error: 'Refresh token not found' });
            }

            const decoded = jwt.verify(refreshToken, process.env.PRIVATE_KEY);
            if (!decoded) {
                return res.status(401).json({ error: 'Invalid refresh token' });
            }

            const { userId, role } = decoded;
            const user = await Account.findOne({ _id: userId });

            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            const isRefreshTokenMatch = await bcrypt.compare(refreshToken, user.refreshToken);
            if (!isRefreshTokenMatch) {
                return res.status(401).json({ error: 'Refresh token not match' });
            }

            const accessToken = jwt.sign({ userId, role }, process.env.PRIVATE_KEY, { expiresIn: "7d" });
            const newRefreshToken = jwt.sign({ userId, role }, process.env.PRIVATE_KEY);
            const hashNewRefreshToken = bcrypt.hashSync(newRefreshToken, 10);

            const updatedUser = await Account.findByIdAndUpdate(user._id, { refreshToken: hashNewRefreshToken }, { new: true });

            if (!updatedUser) {
                return res.status(401).json({ error: 'Failed to update refresh token' });
            }

            res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
            res.status(200).json({ message: 'Refresh token successfully', accessToken });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
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
                        email: user.emails[0].value,
                        role: 'user'
                    }, process.env.PRIVATE_KEY, { expiresIn: '24h' })
                    res.status(200).send({ message: "Đăng nhập thành công bằng Google", token: token })
                }
            })(req, res)
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Lỗi đăng nhập bằng Google" });
        }
    },
    register: async (req, res) => {
        const usernameRegex = /^[a-z0-9]+$/;
        const emailRegex = /^\S+@\S+\.\S+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        try {
            const { email, username, password, confirmPassword } = req.body

            if (!usernameRegex.test(username.toLowerCase())) {
                return res.status(400).send("Username must only contain lowercase alphanumeric characters.");
            }
            if (!emailRegex.test(email.toLowerCase())) {
                return res.status(400).send("Invalid email format.");
            }
            if (!passwordRegex.test(password)) {
                return res.status(400).send("Password must be at least 8 characters long and contain at least one letter, one number, and one special character.");
            }
            if (!passwordRegex.test(confirmPassword)) {
                return res.status(400).send("Password must be at least 8 characters long and contain at least one letter, one number, and one special character.");
            }
            if (password !== confirmPassword) {
                return res.status(400).send({ message: "Password and Confirm Password not match" })
            }
            const isUsernameExist = await Account.findOne({ username: username })
            if (isUsernameExist) {
                return res.status(400).send({ message: "Username exist" })
            } else {
                const isEmailExist = await Account.findOne({ email: email })
                if (isEmailExist) {
                    return res.status(400).send({ message: "Email exist" })
                } else {
                    const token = crypto.randomBytes(32).toString('hex')
                    const hashPassword = bcrypt.hashSync(password, 10)
                    const newUser = new Account({
                        email: email,
                        username: username,
                        password: hashPassword,
                        verifyToken: token
                    })
                    await newUser.save()


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
                        to: newUser.email || '',
                        subject: 'Verify Account',
                        html: `
                        <p>Xin chào ${newUser.username},</p>
                        <p>Cảm ơn bạn đã đăng ký tài khoản trên trang web của chúng tôi.</p>
                        <p>Vui lòng nhấn vào đường link sau để xác thực tài khoản:</p>
                        <p><a href="http://localhost:3000/api/account/verify/${token}">http://localhost:3000/api/account/verify/${token}</a></p>
                        <p>Nếu bạn không phải là người đăng ký tài khoản, vui lòng bỏ qua email này.</p>
                      `
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).send({ message: 'Internal server error' });
                        } else {
                            console.log('Email sent: ' + info.response);
                            return res.status(200).send({ message: 'Verify account email has been sent' });
                        }
                    });
                    //res.status(200).send({ message: 'Tạo tài khoản thành công' })
                }
            }

        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Server Internal Error" })
        }
    },
    verifyAccountAfterRegister: async (req, res) => {
        const { token } = req.params
        try {
            const user = await Account.findOne({ verifyToken: token })
            if (!user) return res.status(400).send({ message: 'Invalid token' })
            user.isVerified = true
            user.verifyToken = undefined
            await user.save()

            const accessToken = jwt.sign(
                {
                    userId: user._id,
                    role: user.role
                },
                process.env.PRIVATE_KEY,
                { expiresIn: "24h" })

            return res.status(200).send({ message: 'Verification successful, ready auto login to website', accessToken: accessToken });
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Server Internal Error" })
        }
    },
    updateAccount: async (req, res) => {
        try {
            const { name, bio } = req.body;
            const { userId } = req.userData
            const account = await Account.findOne({ _id: userId });
            if (!account) {
                return res.status(404).send({ message: "Tài khoản không tồn tại" });
            }
            const avatar = req.file ? req.file.path : account.avatar; // Nếu có tệp tin hình ảnh tải lên thì sử dụng đường dẫn tạm thời của nó, nếu không thì sử dụng đường dẫn avatar hiện tại
            const publicId = path.basename(avatar, path.extname(avatar));
            const result = await cloudinary.uploader.upload(avatar, { public_id: publicId, folder: 'Avatars' })
            if (!result) return res.status(400).send('Lỗi upload lên cloudinary')
            const urlAvatar = result.secure_url
            const updateAccount = await Account.findOneAndUpdate(
                { _id: userId },
                { name: name, bio: bio, avatar: urlAvatar },
                { new: true }
            );
            res.status(200).send(updateAccount);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    },
    sendOtpToEmail: async (req, res) => {
        const { userId } = req.userData
        try {
            const user = await Account.findOne({ _id: userId })
            if (!user) return res.status(400).send({ message: 'User not found' });

            const otp = generateOtp()
            user.otp = otp
            await user.save()

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
                subject: 'OTP Verification',
                text: `Your OTP is ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send({ message: 'Internal server error' });
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.status(200).send({ message: 'OTP Verification email has been sent' });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error' });
        }
    },
    verifyOtp: async (req, res) => {

        const { otp } = req.body;
        const { userId } = req.userData
        try {
            const user = await Account.findOne({ _id: userId, otp: otp })
            if (!user) return res.status(400).send({ message: 'Invalid OTP' });
            return res.status(200).send({ message: 'Verify success' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error' });
        }
    },
    changePassword: async (req, res) => {
        const { newPassword } = req.body
        const { userId } = req.userData
        try {
            const user = await Account.findOne({ _id: userId })
            if (!user) return res.status(400).send({ message: 'User not found' });
            if (newPassword === '') return res.status(400).send({ message: 'Password cannot be blank' })
            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
            if (!newPassword.match(passwordRegex)) {
                return res.status(400).send({ message: 'New password is not valid' });
            }

            // Cập nhật mật khẩu mới và xoá OTP
            user.password = await bcrypt.hash(newPassword, 10);
            user.otp = null;
            await user.save();

            return res.status(200).send({ message: 'Password updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error' });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { emailOrUsername } = req.body;

            // Tìm người dùng trong database bằng email hoặc username
            const user = await Account.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
            if (!user) {
                return res.status(400).send({ message: 'User not found' });
            }

            // Tạo một mã reset password token ngẫu nhiên
            const token = bcrypt.hashSync(Date.now().toString(), bcrypt.genSaltSync(10));

            // Lưu token vào database với thông tin người dùng và thời gian hết hạn
            const expires = moment().add(1, 'hours');
            const resetPasswordToken = new ResetPasswordToken({
                userId: user._id,
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
                    return res.status(500).send({ message: 'Internal server error' });
                } else {
                    console.log('Email sent: ' + info.response);
                    return res.status(200).send({ message: 'Reset password email has been sent' });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error' });
        }
    },
    resetPasswordToken: async (req, res) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        try {
            const { password } = req.body;
            const { token } = req.query;

            // Kiểm tra xem token có hợp lệ hay không
            const resetPasswordToken = await ResetPasswordToken.findOne({ token: token });
            if (!resetPasswordToken) {
                return res.status(400).send({ message: 'Invalid token' });
            }

            // Kiểm tra xem token đã hết hạn hay chưa
            const now = moment();
            const expires = moment(resetPasswordToken.expires);
            if (now.isAfter(expires)) {
                await resetPasswordToken.deleteOne();
                return res.status(400).send({ message: 'Token has expired' });
            }

            // Cập nhật mật khẩu của người dùng
            const user = await Account.findOne({ _id: resetPasswordToken.userId });
            if (!user) {
                return res.status(400).send({ message: 'User not found' });
            }

            if (!passwordRegex.test(password)) {
                return res.status(400).send("Password must be at least 8 characters long and contain at least one letter, one number, and one special character.");
            }

            user.password = bcrypt.hashSync(password, 10);
            await user.save();

            // Xóa token khỏi database
            await resetPasswordToken.deleteOne();

            return res.status(200).send({ message: 'Password reset successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error' });
        }

    }
}

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
