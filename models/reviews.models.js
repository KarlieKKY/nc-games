const db = require("../db/connection");

exports.fetchReviewId = (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }

  const queryStr = `
  SELECT reviews.* , count(comments.comment_id) AS comment_count 
  FROM reviews 
  LEFT JOIN comments 
  ON reviews.review_id = comments.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id;
  `;

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

exports.createNewReview = async (review) => {
  const { owner, title, review_body, designer, review_img_url, category } =
    review;

  const queryValues = [title, designer, owner, review_body, category];
  let queryStr = `
  WITH new_review AS (
  INSERT INTO
    reviews
      (title, designer, owner, review_body, category`;
  let queryInsertValue = " VALUES ($1, $2, $3, $4, $5";

  if (review_img_url && review_img_url.trim() !== "") {
    queryStr += ", review_img_url";
    queryValues.push(review_img_url);
    queryInsertValue += ", $6";
  }

  queryStr += ")";
  queryInsertValue += ")";

  queryStr += queryInsertValue;

  queryStr += ` RETURNING *),
  comment_count_table AS (
    SELECT 
      review_id, COUNT(*) AS comment_count
    FROM 
      comments
    GROUP BY 
      review_id
  )
  SELECT 
    new_review.*, COALESCE(comment_count_table.comment_count, 0) as comment_count
  FROM 
    new_review
  LEFT JOIN 
    comment_count_table 
  ON 
    new_review.review_id = comment_count_table.review_id;`;

  const result = await db.query(queryStr, queryValues);
  return result.rows[0];
};
