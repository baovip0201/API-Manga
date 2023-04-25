const {model, Schema}=require('mongoose')

const ratingSchema= new Schema({
    mangaId: {type: String, required: true, ref: 'Manga', localField: 'mangaId', foreignField: 'mangaId'},
    userId: {type: String, required: true, ref: 'Account', localField: 'userId', foreignField: 'userId'},
    star: {type : Number, min: 1, max: 5},
    createdAt: {type: Date}
})

module.exports=model('RatingManga', ratingSchema)