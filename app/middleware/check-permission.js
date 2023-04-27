
module.exports = {
    checkPermissions: (roles) => async (req, res, next) => {
        const { role } = req.userData
        try {
            // Kiểm tra quyền truy cập
            if (!roles.includes(role)) return res.status(403).send({ message: 'You are not authorized to access this resource' });

            // Cho phép truy cập
            next();
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    }
}

