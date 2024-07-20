const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const {topicData, articleData, userData, commentData} = require('../db/data/test-data/index');
const endpoints = require('../endpoints.json');
const {response} = require('express');
const { title } = require('node:process');

beforeEach(() => seed({topicData, articleData, userData, commentData}))

afterAll(() => db.end())

describe('GET /api/topics', () =>{
    test('should respond with a 200 status code and returns all topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            expect(response.body.length).toBe(3);
            response.body.forEach(topic => {
              expect(topic).toEqual({
                slug: expect.any(String),
                description: expect.any(String)
              })
            });
        })
    })
});
describe('GET /api', () => {
  test('should respond with a 200 status and the contents of endpoints.json', () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then(({body}) => {
      expect(body.endpoints).toEqual(endpoints)
    })
  });
});
describe('GET /api/articles/:article_id', () => {
  test('should respond with a 200 status and return an article by id', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({body}) => {
      expect(body.article).toEqual({
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      });
    })
  });
  test('returns 400 status when given an invalid article id', () => {
    return request(app)
    .get('/api/articles/number')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('400 Bad request')
    })
  });
  test('returns 404 status when given a valid article id but it does not exist', () => {
    return request(app)
    .get('/api/articles/30')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('No article found under article_id 30')
    })
  })
});
describe('GET /api/articles', () => {
  test('should respond with 200 status and return all articles without the body', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response) => {
      expect(response.body).toHaveProperty('articles');
      expect(Array.isArray(response.body.articles)).toBe(true);
      response.body.articles.forEach((article) => {
        console.log(article)
        expect(article).toHaveProperty('author');
          expect(article).toHaveProperty('title');
          expect(article).toHaveProperty('article_id');
          expect(article).toHaveProperty('topic');
          expect(article).toHaveProperty('created_at');
          expect(article).toHaveProperty('votes');
          expect(article).toHaveProperty('article_img_url');
          expect(article).toHaveProperty('comment_count');
          expect(article).not.toHaveProperty('body');
      })
    })
  });
  test('should respond with 200 status and all articles should be sorted by date in descending order', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((response) => {
      const articles = response.body.articles
      expect(articles).toBeSortedBy('created_at', {descending: true});
    })
  })
});
describe('GET /api/articles/:article_id/comments',() => {
  test('should respond with 200 status and all comments', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then((response) => {
      expect(response.body.comments.length).toBeGreaterThan(0);
      const comments = response.body.comments;
      comments.forEach((comment) => {
        expect(comment).toEqual({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        article_id: expect.any(Number)
        })
      })
    })
  })
  test('respond with 200 status and all comments should be sorted by date in descending order', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then((response) => {
      const comments = response.body.comments
      expect(comments).toBeSortedBy('created_at', {descending: true});
    })
  });
  test('should respond with 200 status and return an empty array if article exists but there are no comments', () => {
    return request(app)
    .get('/api/articles/2/comments')
    .expect(200)
    .then((response) => {
      const comments = response.body.comments
      expect(comments).toEqual([]);
    })
  });
  test('respond with 404 status if article does not exist but is valid', () => {
    return request(app)
    .get('/api/articles/33/comments')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toEqual('Sorry article_id 33 Does Not Exist');
    })
  });
  test('respond with 400 status if invalid article ID', () => {
    return request(app)
    .get('/api/articles/banana/comments')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('400 Bad request');
    })
  })
});
describe('POST /api/articles/:article_id/comments', () => {
  test('respond with 201 status, create new comment and return that new comment', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'New random comment',
    }
    return request(app)
    .post('/api/articles/1/comments')
    .send(newComment)
    .expect(201)
    .then((response) => {
      const comments = response.body
      expect(comments).toMatchObject({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: 'butter_bridge',
        body: 'New random comment',
        article_id: 1
        })
    })
  })
  test('returns 400 status if article ID is not valid', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'New random comment'
    }
    return request(app)
    .post('/api/articles/banana/comments')
    .send(newComment)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('400 Bad request')
    })
  });
  test('returns 404 status if username key is invalid', () => {
    const newComment = {
      username: '',
      body: 'New random comment'
    }
    return request(app)
    .post('/api/articles/1/comments')
    .send(newComment)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Username is required')
    })
  });
  test('returns 404 status if article ID is valid but does not exist', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'New random comment'
    }
    return request(app)
    .post('/api/articles/999/comments')
    .send(newComment)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Sorry article_id 999 Does Not Exist')
    })

  });
  test('returns 400 status if body is invalid', () => {
    const newComment = {
      username: 'butter_bridge'
    }
    return request(app)
    .post('/api/articles/1/comments')
    .send(newComment)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('Body is required')
    })

  });
});
describe('PATCH /api/articles/:article_id', () =>  {
  test('should return status 200 and increase vote by number of votes', () => {
    return request(app)
    .patch('/api/articles/1')
    .send({ inc_votes: 1 })
    .expect(200)
    .then(({body}) => {
      expect(body.article.votes).toBe(101)
    })
  });
  test('should return status 200 and decrease vote by number of votes', () => {
    return request(app)
    .patch('/api/articles/1')
    .send({ inc_votes: -1 })
    .expect(200)
    .then(({body}) => {
      expect(body.article.votes).toBe(99)
    })
  });
  test('should return status 400 if votes are missing', () => {
    return request(app)
    .patch('/api/articles/1')
    .send({})
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('Invalid request body')
    })
  });
  test('should return 400 status for invalid votes patch request', () => {
    return request(app)
    .patch('/api/articles/1')
    .send({ inc_votes: 'banana' })
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('Invalid request body')
    })
  });
  test('should return 400 status if invalid article ID format', () => {
    return request(app)
    .patch('/api/articles/banana')
    .send({ inc_votes: 1 })
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('400 Bad request')
    })
  });
  test('should return 404 status if article ID is valid but does not exist', () => {
    return request(app)
    .patch('/api/articles/999')
    .send({ inc_votes: 1 })
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Sorry article_id 999 Does Not Exist')
    })
  });
});
describe('DELETE /api/comments/:comment_id', () => {
  test('should return 204 status and successfully delete comment returning no content', () => {
    return request(app)
    .delete('/api/comments/1')
    .expect(204)
    });
  test('should return 400 status if comment_id is invalid', () => {
    return request(app)
    .delete('/api/comments/banana')
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe('400 Bad request')
    })
  });
  test('should return 404 status if comment does not exist in database', () => {
    return request(app)
    .delete('/api/comments/999')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Sorry comment_id 999 Does Not Exist')
    })
  });
});