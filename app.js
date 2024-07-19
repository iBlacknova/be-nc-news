const express = require('express');
const {endpoints} = require('./endpoints.json');
const {getTopics,getAllEndpoints, getArticlesById, getAllArticles, getAllComments, postComment} = require('./controller');
const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api', getAllEndpoints);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id/comments', getAllComments);

app.post('/api/articles/:article_id/comments', postComment)

app.use((err, req, res, next) => {
    if (err.code === '22P02'){
        res.status(400).send({msg: '400 Bad request'});
    }
    if (err.code === '23503'){
        res.status(404).send({msg: 'Username is required'});
    }
    if (err.code === '23502'){
        res.status(400).send({msg: 'Body is required'});
    }
    else {
        next(err);
    }
});


app.use((err, req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }else {
        next(err);
    }
});


app.all('*', (req, res, next) => {
     res.status(404).send({msg: '404 - request not found'})
});

handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: "Internal Server Error"})
};
module.exports = app