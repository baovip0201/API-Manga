const {model, Schema, mongoose}=require('mongoose')
const chapterSchema= new Schema({
    mangaId: {type: mongoose.Types.ObjectId, ref: 'Manga',required: true},
    updatedAt: {type: Date},
    nameChapter: {type: String},
    urlImageChapter: {type: [String]},
})

module.exports=model('Chapter', chapterSchema)