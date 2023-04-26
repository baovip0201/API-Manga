const {model, Schema, default: mongoose}=require('mongoose')
const favoriteSchema= new Schema({
    mangaId: {type: mongoose.Types.ObjectId, ref: 'Manga', required: true},
    userId: {type: mongoose.Types.ObjectId, ref: 'Account', required: true},
    createdAt: {type: Date}
})

module.exports=model('Favorite', favoriteSchema)