const express = require('express');
const {getTopics} = require('./controllers/topics-controller');
const app = express();

app.get('/api/topics', getTopics);

handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: "Internal Server Error"})
};
module.exports = app