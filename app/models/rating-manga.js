const {model, Schema, default: mongoose}=require('mongoose')

const ratingSchema= new Schema({
    mangaId: {type: mongoose.Types.ObjectId, required: true, ref: 'Manga', },
    userId: {type: mongoose.Types.ObjectId, required: true, ref: 'Account',},
    star: {type : Number, min: 1, max: 5},
    createdAt: {type: Date}
})

module.exports=model('RatingManga', ratingSchema)