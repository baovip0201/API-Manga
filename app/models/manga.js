const {model, Schema}=require('mongoose')
const mangaSchema= new Schema({
    id_manga: {type: String, require: true},
    name_manga: {type: String, require: true},
    description_manga: {type: String},
    author_manga: {type: String, require: true},
    avatar_manga: {type: String, require: true},
    publish_manga: {type: Number},
    genre_manga: [{
        type: String
    }],
    view_manga: {type: Number},
    chapters_manga: [{
        id_chaper:{type: String, require: true},
        name_chapter:{type: String, require: true},
        url_img_chapter:[
            {type: String, require: true}
        ]
    }]

})

module.exports=model('Manga', mangaSchema)