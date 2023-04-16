const {model, Schema}=require('mongoose')

const genreSchema=new Schema({
    genre_id: {type: String, require: true},
    genre_name: {type: String, require: true},
    decription: {type: String, require: true},
})

module.exports= model('Genre', genreSchema)