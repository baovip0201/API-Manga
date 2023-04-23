const {model, Schema}=require('mongoose')
const favoriteSchema= new Schema({
    mangaId: {type: String, ref: 'Manga', localField: 'mangaId', foreignField: 'mangaId',required: true},
    username: {type: String, ref: 'Account', localField: 'username', foreignField: 'username',required: true},
    createdAt: {type: Date}
})

module.exports=model('Favorite', favoriteSchema)