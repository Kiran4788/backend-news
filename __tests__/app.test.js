const endpointsJson = require("../endpoints.json");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => seed(testData));

afterAll(() => db.end());
// Close the database connection after all tests are done

describe("GET /api", () => {
  test("200: Responds withkiran4788 an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

//Handle invalid paths
describe("GET /api/invalidPath", () => {
  test("404: Responds with an error message when given an invalid path", () => {
    return request(app)
      .get("/api/invalidPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path Not Found");
      });
  });
});

//GET /api/topics would get an array of topic objects , each of which should have
// slug and description properties
describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

// GET /api/articles/:article_id
describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the article object with the specified article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          body: expect.any(String),
          votes: expect.any(Number),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });
      });
  });
  // 400: Responds with an error message when given an invalid article_id
  test("400: Responds with an error message when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  // 404: Responds with an error message when given a valid article_id that does not exist
  test("404: Responds with an error message when given a valid article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });
});

//GET /api/articles get an articles array with comment_count , sorted by date
// in descening order with no body property
describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects, each with comment_count property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            votes: expect.any(Number),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

//GET /api/articles/:article_id/comments get an array of comments for
// the given article_id sorted by most recent first
describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBeGreaterThan(0);
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  test("200: Responds with an empty array when there are no comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(0);
      });
  });
  test("400: Responds with an error message when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: Responds with an error message when given a valid article_id that does not exist", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });
});

//POST /api/articles/:article_id/comments , should respond with the posted comment
// should take in a comment object with username and body properties
describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "This is a new comment",
          votes: 0,
          created_at: expect.any(String),
          author: "butter_bridge",
          article_id: 1,
        });
      });
  });
  test("400: Responds with an error message when given an invalid article_id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: Responds with an error message when given a valid article_id that does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/99999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });
  test("400: Responds with an error message when given an invalid comment object", () => {
    const newComment = {
      username: "butter_bridge",
      body: 12345, // Invalid body
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: Responds with an error message when given a username that does not exist", () => {
    const newComment = {
      username: "non_existent_user",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User Not Found");
      });
  });
  test("400: Responds with an error message when given a comment object without required properties", () => {
    const newComment = {
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: Responds with an error message when given a comment object with invalid username", () => {
    const newComment = {
      username: 12345, // Invalid username
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

//patch /api/articles/:article_id , body accepts an object with inc_votes property
// which is a number
describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article object", () => {
    const updateVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          body: expect.any(String),
          votes: 105,
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });
      });
  });
  test("200: Responds with the updated article object with negative inc_votes", () => {
    const updateVotes = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          body: expect.any(String),
          votes: 90,
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: Responds with an error message when given an invalid article_id", () => {
    const updateVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/invalid_id")
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: Responds with an error message when given a valid article_id that does not exist", () => {
    const updateVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/99999")
      .send(updateVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });
  test("400: Responds with an error message when given an invalid inc_votes value", () => {
    const updateVotes = { inc_votes: "invalid_value" };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: Responds with an error message when given an empty request body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: Responds with an error message when given an invalid request body", () => {
    const updateVotes = { invalid_key: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

//DELETE /api/comments/:comment_id , should respond with status 204 and no content
describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content when given a valid comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        // Check that the comment has been deleted from the database
        db.query("SELECT * FROM comments WHERE comment_id = 1").then(
          (result) => {
            expect(result.rows.length).toBe(0);
          }
        );
      });
  });
  test("400: Responds with an error message when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: Responds with an error message when given a valid comment_id that does not exist", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment Not Found");
      });
  });
});

//GET /api/users , should respond with an array of user objects
//Each object should have username, name, avatar_url properties
describe("GET /api/users", () => {
  test("200: Responds with an array of user objects, each with username, name, and avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

//GET /api/articles sort_by query (takes any valid column) and order query
// (takes asc or desc)
describe("GET /api/articles?sort_by=column&order=asc|desc", () => {
  test("200: Responds with an array of articles sorted by the specified column in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("title");
        expect(articles).toBeInstanceOf(Array);
      });
  });
  test("200: Responds with an array of articles sorted by the specified column in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("200: Responds with an array of articles sorted by the article_id in default order", () => {
    return request(app)
      .get("/api/articles?sort_by=ARTICLE_ID")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("article_id", {
          descending: true,
        });
        expect(articles).toBeInstanceOf(Array);
      });
  });
  test("200: Responds with an array of articles ordered in ascending order with default order by clause , created_at", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("400: Responds with an error message when given an invalid sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_column&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort query");
      });
  });
  test("400: Responds with an error message when given an invalid order value", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=invalid_order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });
  test("200: Responds with an array of articles sorted by the default column (created_at) in descending order when no query parameters are provided", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

//GET /api/articles (topic query)  
// should respond with an array of articles filtered by the specified topic
describe("GET /api/articles?topic=topic_slug", () => {
  test("200: Responds with an array of articles filtered by the specified topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("200: Responds with an array of articles with topic, sort_by and order query params",()=>{
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=title&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("title");
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("200: Responds with an empty array when there are no articles for the specified topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(0);
      });
  });
  test("404: Responds with a 404 error message when given an invalid topic slug", () => {
    return request(app)
      .get("/api/articles?topic=invalid_topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic Not Found");
      });
  });
});
