const {model, Schema}=require('mongoose')

const commentSchema=new Schema({
    manga_id: {type: String, require: true},
    chapter_id: {type: String, require: true},
    author: {type: String, require: true},
    content: {type: String, require: true},
})

module.exports= model('Comment', commentSchema)