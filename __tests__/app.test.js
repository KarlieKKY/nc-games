const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const fs = require("fs/promises");

afterAll(() => {
  db.end();
});
beforeEach(() => {
  return seed({
    categoryData,
    commentData,
    reviewData,
    userData,
  });
});

describe("/api", () => {
  const readFile = fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((result) => {
      return JSON.parse(result);
    });
  test("GET - status: 200 - returns an object of all enpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        readFile.then((result) => {
          expect(body.endpoints).toEqual(result);
          expect(typeof body.endpoints).toBe("object");
          expect(Array.isArray(body.endpoints)).toBe(false);
        });
      });
  });
  test("Each endpoint should have a description property", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        for (const endpoint in body.endpoints) {
          expect(body.endpoints[endpoint].hasOwnProperty("description")).toBe(
            true
          );
        }
      });
  });
});

describe("/api/categories", () => {
  test("GET - status: 200 - responds with an array of category objects with corresponding properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        const category = response.body.category;
        expect(category.length).toBe(4);
        category.forEach((eachCat) => {
          expect(eachCat.hasOwnProperty("slug")).toBe(true);
          expect(eachCat.hasOwnProperty("description")).toBe(true);
          expect(typeof eachCat.slug).toBe("string");
          expect(typeof eachCat.description).toBe("string");
        });
      });
  });
});

describe("/api/users", () => {
  test("GET - status: 200 - returns an array of user objects and each object has corresponding properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        expect(Array.isArray(body.users)).toBe(true);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("GET - status: 200 - returns a user object which should have corresponding propertites", async () => {
    const { body } = await request(app)
      .get("/api/users/mallionaire")
      .expect(200);
    expect(body.username).toEqual({
      username: "mallionaire",
      name: "haz",
      avatar_url:
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
    });
  });
  test("GET - status: 404 - returns a message when username is not exist in the database", async () => {
    const { body } = await request(app).get("/api/users/nonsense").expect(404);
    expect(body.msg).toEqual("Username not found!");
  });
});

describe("/api/reviews", () => {
  test("GET - status: 200 - returns a reviews array of review object, each of which should have the corresponding properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(2);
        body.reviews.forEach((review) => {
          expect(typeof review.review_id).toBe("number");
          expect(typeof review.owner).toBe("string");
          expect(typeof review.title).toBe("string");
          expect(typeof review.category).toBe("string");
          expect(typeof review.review_img_url).toBe("string");
          expect(typeof review.created_at).toBe("string");
          expect(typeof review.votes).toBe("number");
          expect(typeof review.designer).toBe("string");
          expect(typeof review.comment_count).toBe("string");
          expect(review.hasOwnProperty("review_body")).toBe(false);
        });
      });
  });
  test("GET - status: 200 - should sorts by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET - status: 200 - returns reviews query sorted by category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        body.reviews.forEach((review) => {
          expect(review.category).toBe("dexterity", {
            descending: true,
          });
        });
      });
  });
  const validSort = [
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
  validSort.forEach((sort_by) => {
    test(`GET - status: 200 - return reviews that sorted by ${sort_by}`, async () => {
      const { body } = await request(app)
        .get(`/api/reviews?sort_by=${sort_by}`)
        .expect(200);
      expect(body.reviews).toBeSortedBy(sort_by, {
        descending: true,
      });
    });
  });
  test("GET - status: 200 - returns reviews in ascending order", async () => {
    const { body } = await request(app)
      .get("/api/reviews?order=asc")
      .expect(200);
    expect(body.reviews).toBeSortedBy("created_at");
  });
  test("GET - status: 400 - returns error when input sort_by is invalid", async () => {
    const { body } = await request(app)
      .get("/api/reviews?sort_by=nonsense")
      .expect(400);
    expect(body).toEqual({ msg: "invalid sort query!" });
  });
  test("GET - status: 404 - returns error when category name is invalid", async () => {
    const { body } = await request(app)
      .get("/api/reviews?category=nonsense")
      .expect(404);
    expect(body).toEqual({ msg: "category name not found!" });
  });
  test("POST - status: 201 - returns an object with the corresponding properties", async () => {
    const { body } = await request(app)
      .post("/api/reviews")
      .send({
        title: "Hello Testing",
        designer: "Karlie *w*",
        owner: "mallionaire",
        review_body: "Griding!",
        category: "euro game",
        review_img_url:
          "https://w7.pngwing.com/pngs/5/1020/png-transparent-peppa-entertainment-one-animated-cartoon-peppa-pig-miscellaneous-television-child-thumbnail.png",
      })
      .expect(201);
    expect(body.newReview.review_id).toBe(14);
    expect(body.newReview.title).toBe("Hello Testing");
    expect(body.newReview.category).toBe("euro game");
    expect(body.newReview.designer).toBe("Karlie *w*");
    expect(body.newReview.owner).toBe("mallionaire");
    expect(body.newReview.review_body).toBe("Griding!");
    expect(body.newReview.review_img_url).toBe(
      "https://w7.pngwing.com/pngs/5/1020/png-transparent-peppa-entertainment-one-animated-cartoon-peppa-pig-miscellaneous-television-child-thumbnail.png"
    );
    expect(typeof body.newReview.created_at).toBe("string");
    expect(body.newReview.votes).toBe(0);
    expect(body.newReview.comment_count).toBe("0");
  });
  test("POST - status: 201 - returns default image url when user not input a review_img_url", async () => {
    const { body } = await request(app)
      .post("/api/reviews")
      .send({
        title: "Hello Testing",
        designer: "Karlie *w*",
        owner: "mallionaire",
        review_body: "Griding!",
        category: "euro game",
      })
      .expect(201);
    expect(body.newReview.review_img_url).toBe(
      "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?w=700&h=700"
    );
  });
});

describe("/api/reviews/:review_id", () => {
  test("GET - status: 200 - returns an object regarding to the review id", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const result = {
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 1,
          comment_count: "0",
        };
        expect(body.review).toEqual(result);
      });
  });
  test("GET - status: 400 - return a message when review is not well formed", () => {
    return request(app)
      .get("/api/reviews/nonsense")
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ msg: "Bad request!" });
      });
  });
  test("GET - status: 404 - returns a message when the review id is valid but non-existent in the databse", () => {
    return request(app)
      .get("/api/reviews/99999999")
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ msg: "Review Id not found!" });
      });
  });
  test("PATCH - status: 200 - returns an updated votes of review object when vote is a positive number", () => {
    return request(app)
      .patch("/api/reviews/1")
      .expect(200)
      .send({
        inc_votes: 1,
      })
      .then((response) => {
        const result = {
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 2,
        };
        expect(response.body.review).toEqual(result);
      });
  });
  test("PATCH - status: 400 - returns a error message when review_id is not well formed", () => {
    return request(app)
      .patch("/api/reviews/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Bad request! Review Id should be a valid number.",
        });
      });
  });
  test("PATCH - status: 404 - returns a error message when review_id is well formed but not exisis in the database", () => {
    return request(app)
      .patch("/api/reviews/999999999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Review Id not found!" });
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("GET - status: 200 - returns an array of comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const result = [
          {
            comment_id: 5,
            body: "Now this is a story all about how, board games turned my life upside down",
            review_id: 2,
            author: "mallionaire",
            votes: 13,
            created_at: "2021-01-18T10:24:05.410Z",
          },
          {
            comment_id: 1,
            body: "I loved this game too!",
            review_id: 2,
            author: "bainesface",
            votes: 16,
            created_at: "2017-11-22T12:43:33.389Z",
          },
          {
            comment_id: 4,
            body: "EPIC board game!",
            review_id: 2,
            author: "bainesface",
            votes: 16,
            created_at: "2017-11-22T12:36:03.389Z",
          },
        ];
        expect(body.comments).toEqual(result);
      });
  });
  test("GET - status: 200 - each comment should has corresponding properties", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.review_id).toBe("number");
        });
      });
  });
  test("GET - status: 200 - should show the most recent comments first", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET - status : 400 - return a message when review is not well formed", () => {
    return request(app)
      .get("/api/reviews/nonsense/comments")
      .expect(400)
      .then((res) => {
        expect(res.body).toEqual({ msg: "Bad request!" });
      });
  });
  test("GET - status: 404 - returns a message when the review id is valid but non-existent in the databse", () => {
    return request(app)
      .get("/api/reviews/99999999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual({ msg: "Review Id not found!" });
      });
  });
  test("POST - status: 201 - adds a new comment and responds with newly created comment", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .expect(201)
      .send({
        username: "philippaclaire9",
        body: "Noob noob",
      })
      .then((response) => {
        const { newComment } = response.body;
        expect(newComment.body).toBe("Noob noob");
        expect(newComment.review_id).toBe(1);
        expect(newComment.author).toBe("philippaclaire9");
        expect(newComment.comment_id).toBe(7);
        expect(newComment.votes).toBe(0);
        expect(typeof newComment.created_at).toBe("string");
      });
  });
  test("POST - status: 400 - returns a message when review_id is not well formed", () => {
    return request(app)
      .post("/api/reviews/not-exists/comments")
      .expect(400)
      .send({
        username: "Karlie",
        body: "Noob Karlie",
      })
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Bad request! Review Id should be a valid number.",
        });
      });
  });
  test("POST - status: 404 - returns a message when review_id is well formd but not exists in the database", () => {
    return request(app)
      .post("/api/reviews/99999999/comments")
      .expect(404)
      .send({
        username: "Karlie",
        body: "Noob Karlie",
      })
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Sorry, the review id you entered is not found!",
        });
      });
  });
  test("POST - status: 404 - returns a message when the author does not exists in the database", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .expect(404)
      .send({
        username: "Noob",
        body: "Nooby Karlie",
      })
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Sorry, the author you entered is not found!",
        });
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("PATCH - status: 200 - returns an updated object of comment by comment id when votes is positive number", async () => {
    const { body } = await request(app)
      .patch("/api/comments/2")
      .expect(200)
      .send({
        inc_votes: 1,
      });
    expect(body.updatedComment).toEqual({
      author: "mallionaire",
      body: "My dog loved this game too!",
      comment_id: 2,
      created_at: "2021-01-18T10:09:05.410Z",
      review_id: 3,
      votes: 14,
    });
  });
  test("PATCH - status: 200 - returns an updated object of comment by comment id when votes is negative number", async () => {
    const { body } = await request(app)
      .patch("/api/comments/2")
      .expect(200)
      .send({
        inc_votes: -1,
      });
    expect(body.updatedComment).toEqual({
      author: "mallionaire",
      body: "My dog loved this game too!",
      comment_id: 2,
      created_at: "2021-01-18T10:09:05.410Z",
      review_id: 3,
      votes: 12,
    });
  });
  test("PATCH - status: 400 - returns a error message when comment_id is not well formed", async () => {
    const { body } = await request(app)
      .patch("/api/comments/not-a-number")
      .expect(400);
    expect(body).toEqual({
      msg: "Bad request! Comment Id should be a valid number.",
    });
  });
  test("PATCH - status: 400 - returns a error message when comment_id is well formed but not exisis in the database", async () => {
    const { body } = await request(app)
      .patch("/api/comments/999999999")
      .expect(404);
    expect(body).toEqual({
      msg: "Comment Id not found!",
    });
  });
  test("DELETE - status: 204 - delete the given comment by comment_id from the database and respond with a 204 No Content status", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE - status: 400 - returns a message when comment_id is not well formed", () => {
    return request(app)
      .delete("/api/comments/idIsString")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual(
          "Bad request! Comment Id should be a valid number."
        );
      });
  });
  test("DELETE - status: 404 - returns a message when comment_id is well formed but not exists in the database", () => {
    return request(app)
      .delete("/api/comments/9999999999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Comment Id not found!");
      });
  });
});

describe("Invalid endpoint", () => {
  test("GET - status: 404 - invalid input throw error", () => {
    return request(app)
      .get("/api/not-a-route")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid endpoint!");
      });
  });
});
