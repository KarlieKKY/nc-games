const db = require("../db/connection");

exports.fetchReviewId = (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }

  const queryStr = `SELECT * FROM reviews WHERE review_id = $1;`;

  return db.query(queryStr, [id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Review Id not found!" });
    } else {
      return result.rows;
    }
  });
};

exports.fetchReviews = (category, sort_by = "created_at", order = "DESC") => {
  const validSortQueries = [
    "created_at",
    "owner",
    "review_id",
    "title",
    "category",
    "designer",
    "review_img_url",
    "votes",
    "comment_count",
  ];
  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort query!" });
  }

  const queryValues = [];

  let queryStr = `
    SELECT reviews.* , count(comments.comment_id) AS comment_count 
    FROM reviews 
    JOIN comments 
    ON reviews.review_id = comments.review_id
    `;

  if (category) {
    queryStr += ` WHERE reviews.category = $1`;
    queryValues.push(category);
  }

  queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr, queryValues).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "category name not found!" });
    } else {
      const formattedData = result.rows.map((obj) => {
        delete obj.review_body;
        return obj;
      });
      return formattedData;
    }
  });
};

exports.fetchReviewidComments = (reviewId) => {
  if (isNaN(reviewId)) {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }
  const queryStr = `
    SELECT comments.*
    FROM comments
    JOIN reviews
    ON reviews.review_id = comments.review_id
    WHERE comments.review_id = $1
    ORDER BY created_at DESC;
    `;

  return db.query(queryStr, [reviewId]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Review Id not found!" });
    } else {
      return result.rows;
    }
  });
};

exports.createComment = (username, body, reviewid) => {
  if (isNaN(reviewid)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request! Review Id should be a valid number.",
    });
  }
  const queryValues = [body, reviewid, username];
  const queryStr = `
    INSERT INTO comments
    (body, review_id, author)
    VALUES
    ($1, $2, $3)
    RETURNING *;
    `;
  return db.query(queryStr, queryValues).then((result) => {
    return result.rows[0];
  });
};

exports.updateVotesByReviewid = (reviewId, addVotes) => {
  if (isNaN(reviewId)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request! Review Id should be a valid number.",
    });
  }
  const queryStr = `
      UPDATE reviews
      SET
          votes = votes + $1
      WHERE
          review_id = $2
        RETURNING *;
      `;
  return db.query(queryStr, [addVotes, reviewId]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Review Id not found!" });
    } else {
      return result.rows[0];
    }
  });
};
