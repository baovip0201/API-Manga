const Permission = require('../models/permission');

module.exports = {
    createPermission: async (req, res) => {
        const permissions = [
            { id: generateRandomID(), name: 'create', role: 'admin' },
            { id: generateRandomID(), name: 'read', role: 'admin' },
            { id: generateRandomID(), name: 'update', role: 'admin' },
            { id: generateRandomID(), name: 'delete', role: 'admin' },
            { id: generateRandomID(), name: 'read', role: 'user' },
            { id: generateRandomID(), name: 'update', role: 'user' },
            { id: generateRandomID(), name: 'delete', role: 'user' },
        ];

        Permission.insertMany(permissions)
            .then(() => console.log('Inserted permissions'))
            .catch(err => console.log(err));
    }
}
function generateRandomID() {
    const min = 100000;
    const max = 999999;
    const randomNum = Math.floor(Math.random() * (max - min + 1) + min);
    return randomNum.toString();
}