const Genre=require('../models/genre')

module.exports = {
    getAllGenre: async (req, res) => {
        try {
            const genres = await Genre.find()
            res.send(genres)
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

    getGenreById: async (req, res) => {
        try {
            const genre = await Genre.findOne({ genre_id: req.params.id })
            res.send(genre)
        } catch (err) {
            res.status(404).send({ message: 'Manga not found' });
        }
    },
    createGenre: async (req, res) => {
        try {
            const genre = await Genre.findOne({ genre_id: req.body.genre_id })
            if (!genre) {
                const newGenre = new Genre({
                    genre_id: req.body.genre_id,
                    genre_name: req.body.genre_name,
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
            const genre = await Genre.findOne({ genre_id: req.params.id })
            if (req.body.genre_name) {
                genre.genre_name = req.body.genre_name
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
            await Genre.deleteOne({ genre_id: req.params.genre_id })
            res.send({ message: 'Genre deleted' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    },

}
