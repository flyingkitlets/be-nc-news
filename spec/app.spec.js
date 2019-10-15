process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
const connection = require("../db/connection");
chai.use(chaiSorted);

describe.only("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it("invalid path / responds with status 404", () => {
    return request(app)
      .get("/api/topicss")
      .expect(404);
  });
  describe("/topics", () => {
    it("GET / responds with status 200", () => {
      return request(app)
        .get("/api/topics")
        .expect(200);
    });
    it("GET / sends all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.eql([
            { slug: "cats", description: "Not dogs" },

            {
              slug: "mitch",
              description: "The man, the Mitch, the legend"
            },
            {
              slug: "paper",
              description: "what books are made of"
            }
          ]);
        });
    });
  });
  describe("/users/:username", () => {
    it("GET / responds with status 200", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200);
    });
    it("GET / responds with status 404 for non-existent user", () => {
      return request(app)
        .get("/api/users/icellusedkarss")
        .expect(404);
    });
    it("GET / responsds with object of selected user", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.eql(
            {
              username: "icellusedkars",
              name: "sam",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
            }
          );
        });
    });
  });
});
