const {
  getReviews,
  getReviewId,
  getReviewidComments,
  postReviewidComments,
} = require("../controllers/reviews.controllers");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews);
reviewsRouter.route("/:review_id").get(getReviewId);
reviewsRouter
  .route("/:review_id/comments")
  .get(getReviewidComments)
  .post(postReviewidComments);
//   .patch(patchCommentsById);

module.exports = reviewsRouter;
