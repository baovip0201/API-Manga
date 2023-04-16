const {model, Schema}=require('mongoose')

const mangaSchema= new Schema({
    id_manga: {type: String, required: true},
    name_manga: {type: String, required: true},
    description_manga: {type: String},
    author_manga: {type: String, required: true},
    avatar_manga: {type: String, required: true},
    publish_manga: {type: Number},
    genre_manga: {
        type: [String]
    },
    view_manga: {type: Number},
    chapters_manga: [{
        id_chaper:{type: String, required: true},
        name_chapter:{type: String, required: true},
        url_img_chapter:[
            {type: String, required: true}
        ]
    }]
})


module.exports=model('Manga', mangaSchema)