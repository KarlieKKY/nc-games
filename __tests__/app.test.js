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
        };
        expect(body.review).toEqual(result);
      });
  });
  test("GET - status : 400 - return a message when review is not well formed", () => {
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
