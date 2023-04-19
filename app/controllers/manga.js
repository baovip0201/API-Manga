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
            const manga = await Manga.findOne({ id_manga: req.params.mangaId })
            res.send(manga)
        } catch (err) {
            res.status(404).send({ message: 'Manga not found' });
        }
    },
    getChapterById: async (req, res) => {
        try {
            const chapter=await Manga.findOne({id_manga: req.params.mangaId, 'chapters_manga.id_chapter': req.params.chapterId})
            if(!chapter) return res.status(404).send({message: 'Chapter or manga not found'})
            res.status(200).send(chapter.chapters_manga[{id_chaper: req.params.chapterId}])
        } catch (error) {
            res.status(404).send({ message: 'Manga not found' });
        }
    }
    ,
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
            const manga = await Manga.findOne({ id_manga: req.body.mangaId })
            if (!manga) {
                const newManga = new Manga({
                    id_manga: req.body.mangaId,
                    name_manga: req.body.mangaName,
                    description_manga: req.body.mangaDescription,
                    author_manga: req.body.mangaAuthor,
                    avatar_manga: req.body.mangaAvatar,
                    publish_manga: req.body.mangaPublish,
                    view_manga: req.body.mangaView,
                    genre_manga: req.body.mangaGenres,
                    chapters_manga: req.body.chaptersManga
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
            const manga = await Manga.findOne({ id_manga: req.params.mangaId })
            if (req.body.name_manga) {
                manga.name_manga = req.body.mangaName
            }

            if (req.body.description_manga) {
                manga.description_manga = req.body.mangaDescription
            }

            if (req.body.author_manga) {
                manga.author_manga = req.body.mangaAuthor
            }

            if (req.body.avatar_manga) {
                manga.avatar_manga = req.body.mangaAvatar
            }

            if (req.body.publish_manga) {
                manga.publish_manga = req.body.mangaPublish
            }

            if (req.body.genre_manga) {
                manga.genre_manga = req.body.mangaGenres
            }
            const updatedManga = await manga.save()
            res.send(updatedManga)
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    deleteManga: async (req, res) => {
        try {
            await Manga.deleteOne({ id_manga: req.params.mangaId })
            res.send({ message: 'Manga deleted' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

}
