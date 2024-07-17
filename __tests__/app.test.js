const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const {topicData, articleData, userData, commentData} = require('../db/data/test-data/index');
const endpoints = require('../endpoints.json');
const {response} = require('express');


beforeEach(() => seed({topicData, articleData, userData, commentData}))

afterAll(() => db.end())

describe('/api/topics', () =>{
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
describe('/api', () => {
  test('should respond with a 200 status and the contents of endpoints.json', () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then(({body}) => {
      expect(body.endpoints).toEqual(endpoints)
    })
  });
});
describe('/api/articles/:article_id', () => {
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
