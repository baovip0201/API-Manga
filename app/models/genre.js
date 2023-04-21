const {model, Schema}=require('mongoose')

const genreSchema=new Schema({
    genreId: {type: String, require: true, unique: true},
    genreName: {type: String, require: true},
    decription: {type: String, require: true},
})

module.exports= model('Genre', genreSchema)