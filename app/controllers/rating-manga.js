const Rating = require('../models/rating-manga')
const Manga = require('../models/manga')
const { default: mongoose } = require('mongoose')

module.exports = {
    getRating: async (req, res) => {
        const { mangaId } = req.params
        try {
            const manga = await Manga.findOne({ _id: mangaId })

            const ratings = await Rating.aggregate([
                { $match: { mangaId: new mongoose.Types.ObjectId(mangaId) } },
                {
                  $group: {
                    _id: '$mangaId',
                    avgStars: { $avg: '$star' },
                    count: { $sum: 1 },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    mangaId: '$_id',
                    avgStars: 1,
                    count: 1,
                  },
                },
              ]);
            if(ratings.length===0) return res.status(200)
            .send({
                manga,
                ratings: {
                    avgStars: 0,
                    count: 0
                }
            });

            return res.status(200)
                .send({
                    manga,
                    ratings: {
                        avgStars: ratings[0].avgStars,
                        count: ratings[0].count
                    }
                });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error' });
        }
    },
    createRating: async (req, res) => {
        const { mangaId } = req.params
        const { star } = req.body
        const { userId } = req.userData
        try {
            if (star < 1 || star > 5) return res.status(400).send({ message: 'Invalid rating value' });

            const existingRating = await Rating.findOne({ userId: userId, mangaId: mangaId })

            if (existingRating) {
                existingRating.star = star
                await existingRating.save()
            } else {
                const newRating = new Rating({
                    userId: userId,
                    mangaId: mangaId,
                    star: star,
                    createdAt: Date.now()
                })
                await newRating.save()
            }
            return res.status(200).send({ message: 'Rating saved' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal server error' });
        }
    }
}