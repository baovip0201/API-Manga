const Comment = require('../models/comment');
const Chapter = require('../models/chapter');

module.exports = {
  getAllComments: async (req, res) => {
    try {
      const { chapterId, mangaId } = req.params;
      const comments = await Comment.find({ chapterId: chapterId, mangaId: mangaId }).populate('user', 'username avatar').sort({ createdAt: 1 });
      console.log(comments)


      //Ánh xạ các bình luận thành một đối tượng với phản hồi của chúng là một thuộc tính lồng nhau
      const mapComments = (comments, parentCommentId = null) => {
        return comments.reduce((acc, comment) => {
          if (comment.parentCommentId && parentCommentId && comment.parentCommentId.equals(parentCommentId)) {
            const replies = mapComments(comments, comment._id);
            const commentObj = {
              ...comment.toObject(),
              replies
            };
            acc.push(commentObj);
          } else if (!comment.parentCommentId && !parentCommentId) {
            const replies = mapComments(comments, comment._id);
            const commentObj = {
              ...comment.toObject(),
              replies
            };
            acc.push(commentObj);
          }
          return acc;
        }, []);
      };
    
      const commentsTree = mapComments(comments);

      res.status(200).send({ comments: commentsTree });
    } catch (error) {
      console.error(error)
      res.status(500).send({ message: "Server Internal Error" })
    }
  },
  createComment: async (req, res) => {
    try {
      const { mangaId, chapterId } = req.params;
      const { commentText, parentCommentId } = req.body;
      const { userId } = req.userData;

      // Kiểm tra chapter
      const chapter = await Chapter.findOne({ mangaId: mangaId, _id: chapterId }).lean();
      if (!chapter) {
        return res.status(400).send({ message: "Manga hoặc chapter không hợp lệ" });
      }

      const newComment = new Comment({
        commentText,
        user: userId,
        mangaId,
        chapterId,
        createdAt: new Date(),
        parentCommentId: parentCommentId || null,
      });
      await newComment.save();


      // Trả về kết quả thành công
      res.status(201).send({ message: "Tạo comment thành công", data: newComment});
    } catch (error) {
      console.error(error);
      res.status(422).send({ message: "Lỗi khi tạo comment" });
    }
  },

  updateComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const { commentText } = req.body;

      const comment = await Comment.findOne({ _id: commentId });
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      if (comment.user.toString() !== req.userData.userId) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      const updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId },
        { commentText: commentText, updatedAt: Date.now() },
        { new: true }
      );

      res.status(200).send(updatedComment);
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

      const comment = await Comment.findOne({ _id: commentId }).lean();
      if (!comment) {
        return res.status(404).send({ message: "Không tìm thấy comment" });
      }

      // Kiểm tra xem người dùng hiện tại có phải là người tạo comment hay không
      if (!comment.user.equals(userId)) {
        return res.status(401).send({ message: "Bạn không có quyền xóa comment này" });
      }

      await Comment.findOneAndRemove({ _id: commentId });
      res.status(200).send({ message: "Xóa comment thành công" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Internal Error" });
    }
  },
  likeComment: async (req, res) => {
    const { commentId } = req.params
    const { userId } = req.body
    try {
      const comment = await Comment.findById(commentId)
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' })
      }
      if (!comment.likes.includes(userId)) {
        comment.likes.push(userId)
        await comment.save()
      }
      const likeCount = comment.likes.length
      res.status(200).send({ likes: likeCount })
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Internal Error" });
    }
  },
  unlikeComment: async (req, res) => {
    const { commentId } = req.params
    const { userId } = req.body
    try {
      const comment = await Comment.findById(commentId)
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' })
      }
      if (comment.likes.includes(userId)) {
        comment.likes.pull(userId)
        await comment.save()
      }
      const likeCount = comment.likes.length
      res.status(200).send({ likes: likeCount })
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server Internal Error" });
    }
  }
}
