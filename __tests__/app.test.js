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
  // test.only("GET - status: 500 - will give 500 when there is a problem with the database", () => {
  //   return request(app)
  //     .get("/api/categories")
  //     .then((response) => {
  //       expect(response.body.msg).toBe("Server Error...");
  //     });
  // });
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
