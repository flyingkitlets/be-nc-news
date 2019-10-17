process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest")(app);
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
const connection = require("../db/connection");
chai.use(chaiSorted);

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it("returns a JSON with information of api", () => {
    return request.get("/api").expect(200);
  });
  describe("/topics", () => {
    it("invalid path / responds with status 404", () => {
      return request.get("/api/topicss").expect(404);
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
    it("GET / responds with status 200", () => {
      return request.get("/api/topics").expect(200);
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
    it("GET / responds with status 200", () => {
      return request.get("/api/users/icellusedkars").expect(200);
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
  describe("/articles", () => {
    it("Responds with 405 for invalid method", () => {
      const invalidMethods = ["put", "patch", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/articles")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("GET / responds with status 200", () => {
      return request.get("/api/articles").expect(200);
    });
    it("GET / sends empty array and status 200 when passed user with no articles", () => {
      return request
        .get("/api/articles?author=lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(0);
        });
    });
    it("GET / sends empty array and status 200 when passed topic with no articles", () => {
      return request
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(0);
        });
    });
    it("GET / sends all articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(12);
          expect(body.articles[0]).to.contain.keys(
            "article_id",
            "votes",
            "title",
            "comment_count",
            "topic",
            "created_at",
            "body",
            "author"
          );
        });
    });
    it("GET / sends all articles in correct order", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });

    it("GET / sends all articles by author", () => {
      return request
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(3);
          let allTrue = true;
          body.articles.forEach(article => {
            if (article.author !== "butter_bridge") allTrue = false;
          });
          expect(allTrue).to.equal(true);
        });
    });
    it("GET / sends all articles by topic", () => {
      return request
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(11);
          let allTrue = true;
          body.articles.forEach(article => {
            if (article.topic !== "mitch") allTrue = false;
          });
          expect(allTrue).to.equal(true);
        });
    });
    it("GET / sends all articles by topic & author", () => {
      return request
        .get("/api/articles?topic=mitch&author=butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(3);
          let allTrue = true;
          body.articles.forEach(article => {
            if (article.topic !== "mitch") allTrue = false;
          });
          body.articles.forEach(article => {
            if (article.author !== "butter_bridge") allTrue = false;
          });
          expect(allTrue).to.equal(true);
        });
    });
    it("GET / sends all articles by topic & author and sorted by custom column", () => {
      return request
        .get("/api/articles?topic=mitch&author=butter_bridge&sort_by=title")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(3);
          let allTrue = true;
          body.articles.forEach(article => {
            if (article.topic !== "mitch") allTrue = false;
          });
          body.articles.forEach(article => {
            if (article.author !== "butter_bridge") allTrue = false;
          });
          expect(allTrue).to.equal(true);
          expect(body.articles).to.be.sortedBy("title", {
            descending: true
          });
        });
    });
    it("GET / sends all articles by topic & author and sorted by custom column & ordered ascending", () => {
      return request
        .get(
          "/api/articles?topic=mitch&author=butter_bridge&sort_by=title&order_by=asc"
        )
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(3);
          let allTrue = true;
          body.articles.forEach(article => {
            if (article.topic !== "mitch") allTrue = false;
          });
          body.articles.forEach(article => {
            if (article.author !== "butter_bridge") allTrue = false;
          });
          expect(allTrue).to.equal(true);
          expect(body.articles).to.be.sortedBy("title", {
            descending: false
          });
        });
    });
    it("GET / sends 404 when invalid sort by author", () => {
      return request
        .get("/api/articles?author=butterscotch_bridge")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("bad request - user not found");
        });
    });
    it("GET / sends 404 when invalid sort by topic", () => {
      return request
        .get("/api/articles?topic=coding")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("bad request - topic not found");
        });
    });
    it("GET / sends 404 when invalid sort by topic but valid author", () => {
      return request
        .get("/api/articles?topic=mike&author=butter_bridge")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("bad request - topic not found");
        });
    });
    it("GET / sends 404 when invalid sort by author but valid topic", () => {
      return request
        .get("/api/articles?topic=mitch&author=butterscotch_bridge")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("bad request - user not found");
        });
    });
  });
  describe("/articles/:article_id", () => {
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
    it("GET / responds with status 200", () => {
      return request.get("/api/articles/1").expect(200);
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
            comment_count: "13"
          });
        });
    });
    it("PATCH / with no body responds with status 200 and article", () => {
      return request
        .patch("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.eql({
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z"
          });
        });
    });
    it("PATCH / responds with 200 and patched article", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: "1" })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.eql({
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 101,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z"
          });
        });
    });
    it("PATCH / with wrong table name returns 400", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votess: "1" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("bad request - invalid entry type");
        });
    });
    it("PATCH / with invalid data-type returns 400", () => {
      return request
        .patch("/api/articles/1")
        .send({ inc_votes: "one" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("bad request - invalid entry type");
        });
    });
    it("PATCH / responds with 400 when trying to patch unauthorised column", () => {
      return request
        .patch("/api/articles/1")
        .send({ body: "new body" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("bad request - invalid entry type");
        });
    });
    it("PATCH / responds with 404 when trying to patch non-existent id", () => {
      return request
        .patch("/api/articles/9999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("path not found");
        });
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("Responds with 405 for invalid method", () => {
      const invalidMethods = ["patch", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/articles/1/comments")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    it("POST / returns 200 and comment when passed a comment", () => {
      return request
        .post("/api/articles/1/comments")
        .send({ body: "here is a new comment", username: "icellusedkars" })
        .expect(200)
        .then(({ body }) => {
          expect(body).to.eql({
            comment_id: 19,
            author: "icellusedkars",
            article_id: 1,
            body: "here is a new comment",
            votes: 0
          });
        });
    });
    it("POST / returns 404 when passed a non-existent param", () => {
      return request
        .post("/api/articles/9999/comments")
        .send({ body: "here is a new comment", username: "icellusedkars" })
        .expect(400);
    });
    it("POST / returns 400 when passed empty comment", () => {
      return request
        .post("/api/articles/9999/comments")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad request - key not found");
        });
    });
    it("POST / returns 400 when passed invalid comment", () => {
      return request
        .post("/api/articles/9999/comments")
        .send({ body: "here is a new comment", usernme: "icellusedkars" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad request - key not found");
        });
    });
    it("GET / sends an array of all comments with desired keys", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).to.equal(13);
          expect(body.comments[0]).to.contain.keys(
            "comment_id",
            "votes",
            "created_at",
            "body",
            "author"
          );
        });
    });
    it("GET / sends all comments with default ordering by created_at when not given a query", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).to.equal(13);
          expect(body.comments).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET / sends all comments with custom ordering by comment_id with default sorting (descending)", () => {
      return request
        .get("/api/articles/1/comments?sort_by=comment_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).to.equal(13);
          expect(body.comments).to.be.sortedBy("comment_id", {
            descending: true
          });
        });
    });
    it("GET / sends all comments with custom ordering by default (created at) ascending", () => {
      return request
        .get("/api/articles/1/comments?order_by=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).to.equal(13);
          expect(body.comments).to.be.sortedBy("created_at", {
            descending: false
          });
        });
    });
    it("GET / sends all comments with custom ordering by comment_id ascending", () => {
      return request
        .get("/api/articles/1/comments?sort_by=comment_id&order_by=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).to.equal(13);
          expect(body.comments).to.be.sortedBy("comment_id", {
            descending: false
          });
        });
    });
    it("GET / returns 404 when endpoint not found", () => {
      return request.get("/api/articles/9999/comments").expect(404);
    });
    it("GET / returns 400 when passed an invalid sort_by", () => {
      return request
        .get("/api/articles/1/comments?sort_by=asci")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad request - column not found");
        });
    });

    it("GET / returns 200 and defaults to created_at descending when passed an invalid order_by", () => {
      return request
        .get("/api/articles/1/comments?order_by=slug")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).to.equal(13);
          expect(body.comments).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
  });
  describe("/comments", () => {
    describe("/:comment_id", () => {
      it("Responds with 405 for invalid method", () => {
        const invalidMethods = ["get", "put"];
        const methodPromises = invalidMethods.map(method => {
          return request[method]("/api/comments/comment_id")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      it("PATCH / with no body responds with status 400", () => {
        return request
          .patch("/api/comments/1")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.eql({
              comment_id: 1,
              author: "butter_bridge",
              article_id: 9,
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              created_at: "2017-11-22T12:36:03.389Z",
              votes: 16
            });
          });
      });
      it("PATCH / responds with 200 and patched comment", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: "1" })
          .expect(200)
          .then(({ body }) => {
            expect(body).to.eql({
              comment_id: 1,
              author: "butter_bridge",
              article_id: 9,
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              created_at: "2017-11-22T12:36:03.389Z",
              votes: 17
            });
          });
      });
      it("PATCH / with wrong table name returns 400", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votess: "1" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("bad request - invalid entry type");
          });
      });
      it("PATCH / with invalid data-type returns 400", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: "one" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("bad request - invalid entry type");
          });
      });
      it("PATCH / responds with 400 when trying to patch unauthorised column", () => {
        return request
          .patch("/api/comments/1")
          .send({ body: "new body" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("bad request - invalid entry type");
          });
      });
      it("PATCH / responds with 404 when trying to patch non-existent id", () => {
        return request
          .patch("/api/comments/9999")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("path not found");
          });
      });
      it("DELETE / with no body responds with status 204", () => {
        return request.delete("/api/comments/1").expect(204);
      });
      it("DELETE / returns 404 if comment id not found", () => {
        return request.delete("/api/comments/9999").expect(404);
      });
    });
  });
});
