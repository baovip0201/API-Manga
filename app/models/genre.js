const {model, Schema}=require('mongoose')

const genreSchema=new Schema({
    genreName: {type: String, require: true},
    decription: {type: String, require: true},
})

module.exports= model('Genre', genreSchema)