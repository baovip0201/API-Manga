const {model, Schema}=require('mongoose')
const chapterSchema= new Schema({
    chapterId: {type: String, required: true, unique: true},
    mangaId: {type: String, ref: 'Manga', localField: 'mangaId', foreignField: 'mangaId',required: true},
    updatedAt: {type: Date, required: true},
    nameChapter: {type: String},
    urlImageChapter: {type: [String]},
})

module.exports=model('Chapter', chapterSchema)