const Manga = require('../models/manga')

module.exports = {
    getAllManga: async (req, res) => {
        try {
            const mangas = await Manga.find()
            res.send(mangas)
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    getFansManga: async (req, res) => {
        
    },
    getMangaById: async (req, res) => {
        try {
            const manga = await Manga.findOne({ id_manga: req.params.mangaId })
            res.send(manga)
        } catch (err) {
            res.status(404).send({ message: 'Manga not found' });
        }
    },
    searchManga: async (req, res) => {
        try {
            const searchQuery = req.params.q
            const results = await Manga.find({ mangaName: { $regex: new RegExp(searchQuery, 'i') } })
            res.send(results)
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    createManga: async (req, res) => {
        try {
            const manga = await Manga.findOne({ id_manga: req.body.mangaId })
            if (!manga) {
                const newManga = new Manga({
                    mangaId: req.body.mangaId,
                    mangaName: req.body.mangaName,
                    mangaDescription: req.body.mangaDescription,
                    mangaAuthor: req.body.mangaAuthor,
                    mangaAvatar: req.body.mangaAvatar,
                    mangaPublish: req.body.mangaPublish,
                    mangaView: req.body.mangaView,
                    mangaGenres: req.body.mangaGenres
                })
                const savedManga = await newManga.save()
                res.status(201).send(savedManga)
            } else {
                return res.status(400).send({ message: 'Manga ID already exists' })
            }
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    viewManga: async (req, res)=>{
        try {
            const manga = await Manga.findOne({mangaId: req.params.mangaId})
            manga.mangaView++
            await manga.save()
        } catch (error) {
            res.status(500).send({ message: error.message });
        }   
    },

    updateManga: async (req, res) => {
        try {
            const manga = await Manga.findOne({ id_manga: req.params.mangaId })
            if (req.body.name_manga) {
                manga.mangaName = req.body.mangaName
            }

            if (req.body.description_manga) {
                manga.mangaDescription = req.body.mangaDescription
            }

            if (req.body.author_manga) {
                manga.mangaAuthor = req.body.mangaAuthor
            }

            if (req.body.avatar_manga) {
                manga.mangaAvatar = req.body.mangaAvatar
            }

            if (req.body.publish_manga) {
                manga.mangaPublish = req.body.mangaPublish
            }

            if (req.body.genre_manga) {
                manga.mangaGenres = req.body.mangaGenres
            }
            const updatedManga = await manga.save()
            res.send(updatedManga)
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    deleteManga: async (req, res) => {
        try {
            await Manga.deleteOne({ mangaId: req.params.mangaId })
            res.send({ message: 'Manga deleted' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

}
