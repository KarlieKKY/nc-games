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
  test("GET - status: 200 - returns an object of all enpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const result = {
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/categories": {
            description: "serves an array of all categories",
            queries: [],
            exampleResponse: {
              categories: [
                {
                  description:
                    "Players attempt to uncover each other's hidden role",
                  slug: "Social deduction",
                },
              ],
            },
          },
          "GET /api/reviews": {
            description: "serves an array of all reviews",
            queries: ["category", "sort_by", "order"],
            exampleResponse: {
              reviews: [
                {
                  title: "One Night Ultimate Werewolf",
                  designer: "Akihisa Okui",
                  owner: "happyamy2016",
                  review_img_url:
                    "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                  category: "hidden-roles",
                  created_at: "2018-05-30T15:59:13.341Z",
                  votes: 0,
                  comment_count: 6,
                },
              ],
            },
          },
        };
        expect(body.endpoints).toEqual(result);
        expect(typeof body.endpoints).toBe("object");
        expect(Array.isArray(body.endpoints)).toBe(false);
      });
  });
  test("Each endpoint should have a description property", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        for (const endpoint in body.endpoints) {
          console.log(endpoint);
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
