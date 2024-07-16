const express = require('express');
const {getTopics} = require('./controllers/topics-controller');
const {endpoints} = require('./endpoints.json');
const {getAllEndpoints} = require('./controllers/api-controller');
const app = express();


app.get('/api/topics', getTopics);

app.get('/api', getAllEndpoints);

handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: "Internal Server Error"})
};
module.exports = app