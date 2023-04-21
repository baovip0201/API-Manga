const {model, Schema}=require('mongoose')

const mangaSchema= new Schema({
    mangaId: {type: String, required: true, unique: true},
    mangaName: {type: String, required: true},
    mangaDescription: {type: String},
    mangaAuthor: {type: String, required: true},
    mangaAvatar: {type: String, required: true},
    mangaPublish: {type: String},
    mangaGenres: {
        type: [String]
    },
    mangaView: {type: Number},
})

module.exports=model('Manga', mangaSchema)