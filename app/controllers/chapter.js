const { default: mongoose } = require('mongoose')
const Chapter = require('../models/chapter')
const Manga = require('../models/manga')
const fs = require('fs')

module.exports = {
    getAllChaptersByMangaId: async (req, res) => {
        try {
            const chapters = await Chapter.find({ mangaId: req.params.mangaId })
            res.send(chapters)
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    getChapterById: async (req, res) => {
        try {
            const manga = await Manga.findOne({ mangaId: req.params.mangaId })
            if (!manga) return res.status(404).send({ message: 'Manga not found' })
            const chapter = await Chapter.findOne({ _id: req.params.chapterId })
            res.status(200).send(chapter)
        } catch (err) {
            res.status(404).send({ message: 'Chapter not found' });
        }
    },
    createChapter: async (req, res) => {
        try {
            const manga = await Manga.findOne({ mangaId: req.body.mangaId })
            if (manga) {
                const newChapter = new Chapter({
                    mangaId: req.body.mangaId,
                    nameChapter: req.body.nameChapter,
                    urlImageChapter: req.body.urlImageChapter,
                })
                const savedChapter = await newChapter.save()
                res.status(201).send(savedChapter)
            } else {
                return res.status(400).send({ message: 'Manga ID is not exists' })
            }
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },


    updateChapter: async (req, res) => {
        try {
            const chapter = await Chapter.findOne({ _id: req.params.chapterId })
            if (req.body.nameChapter) {
                chapter.nameChapter = req.body.nameChapter
            }

            if (req.body.urlImageChapter) {
                chapter.urlImageChapter = req.body.urlImageChapter
            }
            const updatedChapter = await chapter.save()
            res.send(updatedChapter)
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    getChaptersFromJson: async (req, res) => {
        const files = fs.readFileSync('data.json')
        const chapters = JSON.parse(files)
        let result = []
        try {
            for (let i = 0; i < chapters.length; i++) {
                const newChapter = new Chapter({mangaId: chapters[i].mangaId, nameChapter: chapters[i].nameChapter, urlImageChapter: chapters[i].urlImageChapter })
                await newChapter.save()
                result.push(`${chapters[i].nameChapter}`)
            }
            res.send({ message: `${result}` })
        } catch (error) {
            console.error(error)
            res.status(500).send('Internal Server Error')
        }
    },

    deleteChapter: async (req, res) => {
        try {
            await Chapter.deleteOne({ _id: req.params.chapterId })
            res.send({ message: 'Chapter deleted' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    deleteAllChapterById: async (req, res) => {
        try {
            await Chapter.deleteMany({ mangaId: req.params.mangaId })
            res.send({ message: 'Deleted' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }

}
