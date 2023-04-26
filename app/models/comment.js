const { model, Schema } = require('mongoose')

const commentSchema = new Schema({
    commentId: { type: String, required: true, unique: true, },
    commentText: { type: String, required: true },
    userId: { type: String, required: true, ref: 'Account', localField: 'userId', foreignField: 'userId' },
    mangaId: {type: String, ref: 'Manga', localField: 'mangaId', foreignField: 'mangaId',required: true},
    chapterId: { type: String, ref: 'Chapter', localField: 'chapterId', foreignField: 'chapterId' ,required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, },
    parentCommentId: { type: String, default: null }
},{_id: false});

module.exports = model('Comment', commentSchema)
