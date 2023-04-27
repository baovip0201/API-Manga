const Genre=require('../models/genre')
const Manga= require('../models/manga')

module.exports = {
    getAllGenre: async (req, res) => {
        try {
            const genres = await Genre.find()
            res.send(genres)
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    findMangaByGenre: async (req, res) => {
        const {genreName}=req.params
        try {
            const mangas = await Manga.find({mangaGenres: {$in: [genreName]}})
            res.status(200).send(mangas)
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    getGenreById: async (req, res) => {
        try {
            const genre = await Genre.findOne({ _id: req.params.genreId })
            res.send(genre)
        } catch (err) {
            res.status(404).send({ message: 'Manga not found' });
        }
    },
    createGenre: async (req, res) => {
        try {
            const genre = await Genre.findOne({ _id: req.body.genreId })
            if (!genre) {
                const newGenre = new Genre({
                    genre_name: req.body.genreName,
                    decription: req.body.description,
                })
                const savedGenre = await newGenre.save()
                res.status(201).send(savedGenre)
            } else {
                return res.status(400).send({ message: 'Genre ID already exists' })
            }
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },
    updateGenre: async (req, res) => {
        try {
            const genre = await Genre.findOne({ _id: req.params.genreId })
            if (req.body.genre_name) {
                genre.genre_name = req.body.genreName
            }

            if (req.body.description) {
                genre.decription = req.body.description
            }

            const updatedGenre = await genre.save()
            res.send(updatedGenre)
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    deleteGenre: async (req, res) => {
        try {
            await Genre.deleteOne({ _id: req.params.genreId })
            res.send({ message: 'Genre deleted' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

}
