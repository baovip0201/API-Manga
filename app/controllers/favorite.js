const Favorite = require('../models/favorite');
const Manga = require('../models/manga')

module.exports = {
    getMangaFavoriteByUser: async (req, res) => {
        const { userId } = req.userData; // Lấy thông tin user từ token
        try {
            const favoriteMangas = await Favorite.aggregate([
                { $match: { userId: userId } },
                {
                    $lookup: {
                        from: "mangas",
                        localField: "mangaId",
                        foreignField: "mangaId",
                        as: "mangaDetails"
                    }
                },
                {$unwind: "$mangaDetails"},
                {
                    $project: {
                        _id: 0,
                        mangaId: 1,
                        mangaName: "$mangaDetails.mangaName",
                        mangaDescription: "$mangaDetails.mangaDescription",
                        mangaAuthor: "$mangaDetails.mangaAuthor",
                        mangaAvatar: "$mangaDetails.mangaAvatar",
                        mangaPublish: "$mangaDetails.mangaPublish",
                        mangaGenres: "$mangaDetails.mangaGenres",
                        mangaView: "$mangaDetails.mangaView",
                    }
                }
            ])
            // const favoriteMangas= await Favorite.find({userId: userId})
            // let arr=[]
            // for( const manga of favoriteMangas){
            //     const newManga= await Manga.findOne({mangaId: manga.mangaId})
            //     const newArr={
            //         mangaName: newManga.mangaName,
            //         mangaDescription: newManga.mangaDescription,
            //         mangaAuthor: newManga.mangaAuthor,
            //         mangaAvatar: newManga.mangaAvatar,
            //         mangaPublish: newManga.mangaPublish,
            //         mangaGenres: newManga.mangaGenres,
            //         mangaView: newManga.mangaView,
            //     }
            //     arr.push(newArr)
            // }
            res.status(200).send({ userId: userId, FavoriteManga: favoriteMangas });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    },
    getFansManga: async (req, res) => {
        const { mangaId } = req.params; // Lấy mangaId từ URL params
        try {
            //const fansMangas = await Favorite.find({ mangaId: mangaId });
            const fansMangas = await Favorite.aggregate([
                { $match: { mangaId: mangaId } },
                {
                    $group: {
                        _id: '$mangaId',
                        countFavorite: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        mangaId: '$_id',
                        countFavorite: 1,
                    },
                },
            ]);
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
                createdAt: Date.now()
            })
            await newFavorite.save()
            res.status(200).send({ message: "add manga successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    },
    removeFavorite: async (req, res) => {
        const { userId } = req.userData; // Lấy thông tin user từ token
        const { mangaId } = req.params; // Lấy mangaId từ URL params
        try {
            const favorite = await Favorite.findOneAndDelete({ userId: userId, mangaId: mangaId });
            if (favorite) {
                res.status(200).send({ message: "Removed from favorite list" });
            } else {
                res.status(404).send({ message: "Favorite not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    }
}