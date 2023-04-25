const Comment = require('../models/comment');
const Chapter = require('../models/chapter');

module.exports = {
  getAllComments: async (req, res) => {
    try {
      const { chapterId, mangaId } = req.params;
      const comments = await Comment.find({ chapterId, mangaId }).sort({ createdAt: 1 });

      // Ánh xạ các bình luận thành một đối tượng với phản hồi của chúng là một thuộc tính lồng nhau
      const mapComments = (comments, parentCommentId = null) => {
        return comments.reduce((acc, comment) => {
          if (comment.parentCommentId === parentCommentId) {
            const replies = mapComments(comments, comment.commentId);
            const commentObj = { ...comment.toObject(), replies };
            acc.push(commentObj);
          }
          return acc;
        }, []);
      };

      const commentsTree = mapComments(comments);

      res.status(200).send({ comments: commentsTree });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Lỗi nội bộ máy chủ" });
    }
  },
  createComment: async (req, res) => {
    try {
      const { mangaId, chapterId } = req.params;
      const { commentText, parentCommentId } = req.body;
      const { userId } = req.userData;

      // Kiểm tra chapter
      const chapter = await Chapter.findOne({ mangaId, chapterId }).lean();
      if (!chapter) {
        return res.status(400).send({ message: "Manga hoặc chapter không hợp lệ" });
      }

      // Tạo comment mới
      const commentId = generateRandomID();
      const comment = new Comment({
        commentId,
        commentText,
        userId,
        mangaId,
        chapterId,
        createdAt: new Date(),
        parentCommentId: parentCommentId || null,
      });
      await comment.save();

      // Trả về kết quả thành công
      res.status(201).send({ message: "Tạo comment thành công" });
    } catch (error) {
      console.error(error);
      res.status(422).send({ message: "Lỗi khi tạo comment" });
    }
  },

  updateComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const { commentText, parentCommentId } = req.body;

      const comment = await Comment.findOne({ commentId: commentId });
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      if (comment.userId !== req.userData.userId) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      const updatedComment = await Comment.findOneAndUpdate(
        { commentId: commentId, parentCommentId: parentCommentId },
        { commentText: commentText, updatedAt: Date.now() },
        { new: true }
      );

      res.send(updatedComment);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Internal Error" });
    }
  }

  ,
  deleteComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const { userId } = req.userData;

      const comment = await Comment.findOne({ commentId }).lean();
      if (!comment) {
        return res.status(404).send({ message: "Không tìm thấy comment" });
      }

      // Kiểm tra xem người dùng hiện tại có phải là người tạo comment hay không
      if (comment.userId !== userId) {
        return res.status(401).send({ message: "Bạn không có quyền xóa comment này" });
      }

      await Comment.findOneAndRemove({ commentId });
      res.status(200).send({ message: "Xóa comment thành công" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Internal Error" });
    }
  }
}

function generateRandomID() {
  const min = 100000;
  const max = 999999;
  const randomNum = Math.floor(Math.random() * (max - min + 1) + min);
  return randomNum.toString();
}