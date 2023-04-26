const {model, Schema, mongoose}=require('mongoose')

const mangaSchema= new Schema({
    mangaName: {type: String, required: true},
    mangaDescription: {type: String},
    mangaAuthor: {type: String, required: true},
    mangaAvatar: {type: String, required: true},
    mangaPublish: {type: Date},
    mangaGenres: {
        type: [String]
    },
    mangaView: {type: Number}
})

module.exports=model('Manga', mangaSchema)