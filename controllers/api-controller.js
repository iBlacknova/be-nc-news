const endpoints = require('../endpoints.json')

function getAllEndpoints(req, res){
    res.status(200).send({endpoints});
}

module.exports = {getAllEndpoints}