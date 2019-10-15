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
  describe("/topics", () => {
    it("GET / responds with status 200", () => {
      return request(app)
        .get("/api/topics")
        .expect(200);
    });
  });
});
