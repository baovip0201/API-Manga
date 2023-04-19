const Comment = require('../models/comment');
const Manga = require('../models/manga');

module.exports={
    getAllComments: async (req, res)=>{
        try {
            const mangaId = req.params.mangaId;
            const chapterId = req.params.chapterId;

            const comments = await Comment.find({ manga_id: mangaId, chapter_id: chapterId }).lean();

            res.status(200).json(comments);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    },
    createComment: async (req, res)=>{
        try {
            const { mangaId, chapterId, author, content } = req.body;

            const manga = await Manga.findOne({ id_manga: mangaId }).lean();
            if (!manga) {
                return res.status(404).send({ message: "Không tìm thấy manga" });
            }

            const newComment = new Comment({
                manga_id: mangaId,
                chapter_id: chapterId,
                author: author,
                content: content
            });
            await newComment.save();

            res.status(201).send({ message: "Tạo comment thành công" });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    },
    updateComment: async (req, res)=>{
        try {
            const commentId = req.params.commentId;
            const { author, content } = req.body;

            const comment = await Comment.findById(commentId).lean();
            if (!comment) {
                return res.status(404).send({ message: "Không tìm thấy comment" });
            }

            await Comment.findByIdAndUpdate(commentId, { author: author, content: content });
            res.status(200).send({ message: "Cập nhật comment thành công" });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    },
    deleteComment: async (req, res)=>{
        try {
            const commentId = req.params.commentId;

            const comment = await Comment.findById(commentId).lean();
            if (!comment) {
                return res.status(404).send({ message: "Không tìm thấy comment" });
            }

            await Comment.findByIdAndRemove(commentId);
            res.status(200).send({ message: "Xóa comment thành công" });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Server Internal Error" });
        }
    }
};
