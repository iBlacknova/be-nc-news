const topics = require('./db/data/test-data/topics');
const endpoints = require('./endpoints.json')
const {fetchTopics, fetchArticlesByID, fetchAllArticles, fetchAllComments, checkArticleExists} = require('./model');

function getTopics(req, res){
    fetchTopics()
    .then((topics) => {
        return res.status(200).send(topics);
    })

}

function getAllEndpoints(req, res){
    res.status(200).send({endpoints});
}

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
module.exports = {getTopics,getAllEndpoints, getArticlesById, getAllArticles, getAllComments}