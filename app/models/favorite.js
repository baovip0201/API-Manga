const {model, Schema}=require('mongoose')
const favoriteSchema= new Schema({
    mangaId: {type: String, ref: 'Manga', localField: 'mangaId', foreignField: 'mangaId',required: true},
    userId: {type: String, ref: 'Account', localField: 'userId', foreignField: 'userId',required: true},
    createdAt: {type: Date}
})

module.exports=model('Favorite', favoriteSchema)