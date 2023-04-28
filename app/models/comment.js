const { model, Schema, mongoose } = require('mongoose')

const commentSchema = new Schema({
    commentText: { type: String, required: true },
    likes: {type: [mongoose.Types.ObjectId]},
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'Account'},
    mangaId: {type: mongoose.Types.ObjectId, ref: 'Manga',required: true},
    chapterId: { type: mongoose.Types.ObjectId, ref: 'Chapter' ,required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, },
    parentCommentId: { type: mongoose.Types.ObjectId, default: null, ref: 'Comment' }
});

module.exports = model('Comment', commentSchema)
