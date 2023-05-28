const { removeCommentByCommentid } = require("../models/comments.module");

exports.deleteCommentByCommentid = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByCommentid(comment_id)
    .then((result) => {
      res.status(204).send({ deletedComment: result });
    })
    .catch(next);
};
