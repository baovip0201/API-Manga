const Account = require('../models/account')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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
                            email: data.email
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
                    res.status(200).send({messgae: 'Tạo tài khoản thành công'})
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
    }

    

}