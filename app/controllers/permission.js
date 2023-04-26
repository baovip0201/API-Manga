const Permission = require('../models/permission');

module.exports = {
    createPermission: async (req, res) => {
        const permissions = [
            { id: generateRandomID(), name: 'create Manga', role: 'admin' },
            { id: generateRandomID(), name: 'read Manga', role: 'admin' },
            { id: generateRandomID(), name: 'update Manga', role: 'admin' },
            { id: generateRandomID(), name: 'delete Manga', role: 'admin' },

            { id: generateRandomID(), name: 'create Genre', role: 'admin' },
            { id: generateRandomID(), name: 'read Genre', role: 'admin' },
            { id: generateRandomID(), name: 'update Genre', role: 'admin' },
            { id: generateRandomID(), name: 'delete Genre', role: 'admin' },

            { id: generateRandomID(), name: 'create Chapter', role: 'admin' },
            { id: generateRandomID(), name: 'read Chapter', role: 'admin' },
            { id: generateRandomID(), name: 'update Chapter', role: 'admin' },
            { id: generateRandomID(), name: 'delete Chapter', role: 'admin' },

            { id: generateRandomID(), name: 'create Comment', role: 'admin' },
            { id: generateRandomID(), name: 'read Comment', role: 'admin' },
            { id: generateRandomID(), name: 'update Comment', role: 'admin' },
            { id: generateRandomID(), name: 'delete Comment', role: 'admin' },

            { id: generateRandomID(), name: 'create Manga', role: 'admin' },
            { id: generateRandomID(), name: 'read Manga', role: 'admin' },
            { id: generateRandomID(), name: 'update Manga', role: 'admin' },
            { id: generateRandomID(), name: 'delete Manga', role: 'admin' },

            { id: generateRandomID(), name: 'create Favorite', role: 'admin' },
            { id: generateRandomID(), name: 'read Favorite', role: 'admin' },
            { id: generateRandomID(), name: 'update Favorite', role: 'admin' },
            { id: generateRandomID(), name: 'delete Favorite', role: 'admin' },

            { id: generateRandomID(), name: 'create Account', role: 'admin' },
            { id: generateRandomID(), name: 'read Account', role: 'admin' },
            { id: generateRandomID(), name: 'update Account', role: 'admin' },
            { id: generateRandomID(), name: 'delete Account', role: 'admin' },

            { id: generateRandomID(), name: 'create Rating', role: 'admin' },
            { id: generateRandomID(), name: 'read Rating', role: 'admin' },
            { id: generateRandomID(), name: 'update Rating', role: 'admin' },
            { id: generateRandomID(), name: 'delete Rating', role: 'admin' },

            { id: generateRandomID(), name: 'read Comment', role: 'user' },
            { id: generateRandomID(), name: 'create Comment', role: 'user' },
            { id: generateRandomID(), name: 'update Comment', role: 'user' },
            { id: generateRandomID(), name: 'delete Comment', role: 'user' },

            { id: generateRandomID(), name: 'read Account', role: 'user' },
            { id: generateRandomID(), name: 'create Account', role: 'user' },
            { id: generateRandomID(), name: 'update Account', role: 'user' },
            { id: generateRandomID(), name: 'delete Account', role: 'user' },

            { id: generateRandomID(), name: 'read Manga', role: 'user' },

            { id: generateRandomID(), name: 'read Chapter', role: 'user' },

            { id: generateRandomID(), name: 'read Genre', role: 'user' },

            { id: generateRandomID(), name: 'read Favorite', role: 'user' },
            { id: generateRandomID(), name: 'create Favorite', role: 'user' },
            { id: generateRandomID(), name: 'update Favorite', role: 'user' },
            { id: generateRandomID(), name: 'delete Favorite', role: 'user' },

            { id: generateRandomID(), name: 'read Rating', role: 'user' },
            { id: generateRandomID(), name: 'create Rating', role: 'user' },
            { id: generateRandomID(), name: 'update Rating', role: 'user' },
            { id: generateRandomID(), name: 'delete Rating', role: 'user' },

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