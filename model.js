const db = require('./db/connection')

function fetchTopics(req, res){
    return db.query(`SELECT * FROM topics;`)
    .then((result) => {
        return result.rows;
    })
}

function fetchArticlesByID(article_id){
    return db.query('SELECT * FROM articles WHERE article_id =$1', [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `No article found under article_id ${article_id}`
            })
        }
    return rows[0];
    })
};

function fetchAllArticles(req,res){
    return db.query(`
    SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
    CAST (COUNT(comments.comment_id) AS INT) AS comment_count
    FROM 
      articles
    LEFT JOIN 
      comments ON articles.article_id = comments.article_id
    GROUP BY 
      articles.article_id
    ORDER BY 
      articles.created_at DESC;
    `)
    .then((result
    ) => {
        return result.rows
    })
}
function fetchAllComments(article_id){
    return db.query(`
        SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`, [article_id])
    .then((result) => {
        return result.rows
    })
}

function checkArticleExists(article_id){
    return db.query('SELECT * from articles WHERE article_id = $1',[article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject(
            {status: 404,
            msg: `Sorry article_id ${article_id} Does Not Exist`
            })
        }
        return rows;
    })
}

function insertComment(article_id, username, comment){
    return db.query(`
        INSERT into comments (article_id, author, body)
        VALUES 
            ($1, $2, $3)
        RETURNING *`,[article_id, username, comment])
    .then((result) => {
        return result.rows[0];
    })
};
module.exports = {fetchTopics, fetchArticlesByID, fetchAllArticles, fetchAllComments, checkArticleExists, insertComment}