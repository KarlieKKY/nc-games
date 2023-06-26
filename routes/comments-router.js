const {
  deleteCommentByCommentid,
  patchCommentId,
} = require("../controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentId)
  .delete(deleteCommentByCommentid);

module.exports = commentsRouter;
