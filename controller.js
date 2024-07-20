const { patch } = require('./app');
const topics = require('./db/data/test-data/topics');
const endpoints = require('./endpoints.json')
const {fetchTopics, fetchArticlesByID, fetchAllArticles, fetchAllComments, checkArticleExists, insertComment, updateArticleById} = require('./model');

function getTopics(req, res){
    fetchTopics()
    .then((topics) => {
        return res.status(200).send(topics);
    })

};

function getAllEndpoints(req, res){
    res.status(200).send({endpoints});
};

function getArticlesById(req, res, next){
    const {article_id} = req.params;
    fetchArticlesByID(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err);
    })
};

function getAllArticles(req, res, next){
    fetchAllArticles()
    .then((articles) => {
        return res.status(200).send({articles})
    })
};

function getAllComments(req, res, next){
    const {article_id} = req.params;
    checkArticleExists(article_id)
    .then(() => {
        return fetchAllComments(article_id)
    })
    .then((comments) => {
        return res.status(200).send({comments})
    })
    .catch((err) => {
        next(err);
    })
};

function postComment(req, res, next){
    const {username, body} = req.body;
    const {article_id} = req.params;
    checkArticleExists(article_id)
    .then(() => {
        console.log('in here!')
        return insertComment(article_id, username, body);
    })
    .then((comment) => {
        res.status(201).send(comment);
    })
    .catch((err) => {
        console.log(err)
        next(err);
    })
}
function patchArticleById(req, res, next){
    const {article_id} = req.params;
    const {inc_votes} = req.body;
    if (typeof inc_votes !== 'number') {
        return res.status(400).send({ msg: 'Invalid request body' });
    }
    checkArticleExists(article_id)
    .then(() => {
        return updateArticleById(article_id, inc_votes);
    })
    .then((updatedArticle) => {
        res.status(200).send({article: updatedArticle});
    })
    .catch((err) => {
        console.log(err)
        next(err);
    })
}
module.exports = {getTopics,getAllEndpoints, getArticlesById, getAllArticles, getAllComments, postComment, patchArticleById}