const { removeCommentByCommentid } = require("../models/comments.module");

exports.deleteCommentByCommentid = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByCommentid(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
