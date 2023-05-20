const express = require("express");
const {
  getCategories,
  getEndpoints,
  getReviewId,
  getReviews,
  getReviewidComments,
  postReviewidComments,
} = require("./controllers/categories.controllers");

const app = express();
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewId);
app.get("/api/reviews/:review_id/comments", getReviewidComments);

app.post("/api/reviews/:review_id/comments", postReviewidComments);

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    const isUserErr = /not present in table "users"/.test(err.detail);
    res.status(404).send({
      msg: `Sorry, the ${
        isUserErr ? "author" : "review id"
      } you entered is not found!`,
    });
  } else {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid endpoint!" });
});

module.exports = app;
