const { model, Schema } = require('mongoose')

const commentSchema = new Schema({
    commentId: { type: String, required: true, unique: true, },
    commentText: { type: String, required: true },
    username: { type: String, required: true },
    mangaId: {type: String, ref: 'Manga', localField: 'mangaId', foreignField: 'mangaId',required: true},
    chapterId: { type: String, ref: 'Chapter', localField: 'chapterId', foreignField: 'chapterId' ,required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, },
    parentCommentId: { type: String, default: null }
});

module.exports = model('Comment', commentSchema)
