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

    getMangaById: async (req, res) => {
        try {
            const manga = await Manga.findOne({ id_manga: req.params.id })
            res.send(manga)
        } catch (err) {
            res.status(404).send({ message: 'Manga not found' });
        }
    },
    searchManga: async (req, res) => {
        try {
            const searchQuery = req.params.q
            const results = await Manga.find({ name_manga: { $regex: new RegExp(searchQuery, 'i') } })
            res.send(results)
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    createManga: async (req, res) => {
        try {
            const manga = await Manga.findOne({ id_manga: req.body.id_manga })
            if (!manga) {
                const newManga = new Manga({
                    id_manga: req.body.id_manga,
                    name_manga: req.body.name_manga,
                    description_manga: req.body.description_manga,
                    author_manga: req.body.author_manga,
                    avatar_manga: req.body.avatar_manga,
                    publish_manga: req.body.publish_manga,
                    view_manga: req.body.view_manga,
                    genre_manga: req.body.genre_manga,
                    chapters_manga: req.body.chapters_manga
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


    updateManga: async (req, res) => {
        try {
            const manga = await Manga.findOne({ id_manga: req.params.id })
            if (req.body.name_manga) {
                manga.name_manga = req.body.name_manga
            }

            if (req.body.description_manga) {
                manga.description_manga = req.body.description_manga
            }

            if (req.body.author_manga) {
                manga.author_manga = req.body.author_manga
            }

            if (req.body.avatar_manga) {
                manga.avatar_manga = req.body.avatar_manga
            }

            if (req.body.publish_manga) {
                manga.publish_manga = req.body.publish_manga
            }

            if (req.body.genre_manga) {
                manga.genre_manga = req.body.genre_manga
            }
            const updatedManga = await manga.save()
            res.send(updatedManga)
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    deleteManga: async (req, res) => {
        try {
            await Manga.deleteOne({ id_manga: req.params.id_manga })
            res.send({ message: 'Manga deleted' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

}
