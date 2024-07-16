const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const {topicData, articleData, userData, commentData} = require('../db/data/test-data/index');

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
})