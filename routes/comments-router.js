const {
  deleteCommentByCommentid,
} = require("../controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteCommentByCommentid);

module.exports = commentsRouter;
