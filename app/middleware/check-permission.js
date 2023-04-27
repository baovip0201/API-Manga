const Account = require('../models/account');
const Permission = require('../models/permission');

module.exports = {
    checkPermissions: (permissionName) => async (req, res, next) => {
        const {userId}= req.userData
        try {
            // Lấy thông tin role của user từ database
            const user = await Account.findOne({_id: userId});
            const role = user.role;
            // Kiểm tra quyền truy cập
            const permission = await Permission.findOne({ name: permissionName, role: role });
            if (!permission) {
                return res.status(403).json({ message: 'You are not authorized to access this resource' });
            }
            // Cho phép truy cập
            next();
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    }
}

