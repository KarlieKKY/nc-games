const {
  removeCommentByCommentid,
  updateCommentById,
} = require("../models/comments.module");

exports.patchCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};

exports.deleteCommentByCommentid = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByCommentid(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
