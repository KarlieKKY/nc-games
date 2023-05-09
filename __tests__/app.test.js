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
        });
      });
  });
  test("GET - status: 400 - invalid input throw error", () => {
    return request(app).get("/api/not-a-route").expect(404);
  });
});
