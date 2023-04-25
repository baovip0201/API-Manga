const Favorite = require('../models/favorite')

module.exports = {
    getMangaFavoriteByUser: async (req, res) => {
        const { userId } = req.userData; // Lấy thông tin user từ token
        try {
            const favoriteMangas = await Favorite.find({ userId: userId });
            res.status(200).send(favoriteMangas);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    },
    getFansManga: async (req, res) => {
        const { mangaId } = req.params; // Lấy mangaId từ URL params
        try {
            const fansMangas = await Favorite.find({ mangaId: mangaId });
            res.status(200).send(fansMangas);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    },
    addFavoriteManga: async (req, res) => {
        const { userId } = req.userData
        const { mangaId } = req.body
        try {
            const newFavorite = new Favorite({
                mangaId: mangaId,
                userId: userId,
                createdAt: new Date.now()
            })
            await newFavorite.save()
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    },
    removeFavorite: async (req, res) => {
        const {userId} = req.userData; // Lấy thông tin user từ token
        const {mangaId} = req.params; // Lấy mangaId từ URL params
        try {
            const favorite = await Favorite.findOneAndDelete({userId: userId, mangaId: mangaId});
            if(favorite) {
                res.status(200).send({message: "Removed from favorite list"});
            } else {
                res.status(404).send({message: "Favorite not found"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({message: "Server Internal Error"});
        }
    }
}