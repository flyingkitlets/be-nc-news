process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest")(app);
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
const connection = require("../db/connection");
chai.use(chaiSorted);

describe.only("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it("invalid path / responds with status 404", () => {
    return request.get("/api/topicss").expect(404);
  });
  describe("/topics", () => {
    it("GET / responds with status 200", () => {
      return request.get("/api/topics").expect(200);
    });
    it("Responds with 405 for invalid method", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("GET / sends all topics", () => {
      return request
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
      return request.get("/api/users/icellusedkars").expect(200);
    });
    it("Responds with 405 for invalid method", () => {
      const invalidMethods = ["patch", "put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/users/icellusedkars")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("GET / responds with status 404 for non-existent user", () => {
      return request.get("/api/users/icellusedkarss").expect(404);
    });
    it("GET / responsds with object of selected user", () => {
      return request
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.eql({
            username: "icellusedkars",
            name: "sam",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
          });
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("GET / responds with status 200", () => {
      return request.get("/api/articles/1").expect(200);
    });
    it("PATCH / with no body responds with status 400", () => {
      return request.patch("/api/articles/1").expect(400);
    });
    it("PATCH / responds with 200 and patched article", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: "1" })
        .expect(200)
        .then(({ body }) => {
          expect(body.votes).to.equal(101);
        });
    });
    it("Responds with 405 for invalid method", () => {
      const invalidMethods = ["put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/articles/1")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("GET / responds with status 404 for non-existent article", () => {
      return request.get("/api/articles/999").expect(404);
    });
    it("GET / responsds with object of selected article with comment count", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.eql({
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z",
            comment_count: 13
          });
        });
    });
  });
});
