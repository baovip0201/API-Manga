const {model, Schema}=require('mongoose')
const chapterSchema= new Schema({
    chapterId: {type: String, required: true, unique: true},
    mangaId: {type: String, ref: 'Manga',required: true},
    nameChapter: {type: String},
    urlImageChapter: {type: [String]},
})

module.exports=model('Chapter', chapterSchema)