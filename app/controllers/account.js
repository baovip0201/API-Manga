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
                }
            }

        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Server Internal Error" })
        }
    },
    updateAccount: async (req, res) => {

    }

}