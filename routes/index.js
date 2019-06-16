var express = require('express');
var router = express.Router();
var models = require('../models');
const numberOfPage = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/score', async function(req, res, next) {
    let page = Number(req.query.page);
    if(Number.isNaN(page)) page = 1;
    let query = {
        order: [['score', 'DESC']],
        limit: numberOfPage,
        offset: (page - 1)  * numberOfPage
    };
    let records = await models.scores.findAll(query);
    let objects = [];

    let baseRank = (page - 1) * numberOfPage + 1;

    for(record of records) {
        let uid = record.getDataValue('uid');
        let score = record.getDataValue('score');
        objects.push({
            rank: baseRank,
            uid: uid,
            score: score
        });
        baseRank++;
    }

    const resObject = {
        page: page,
        scores: objects,
        numOfPage: Math.floor((await models.scores.count() / numberOfPage) + 1)
    };
    res.render('scores', resObject);
});

router.post('/score/create', async function(req, res, next) {
    let score = req.body.score;
    let uid = req.body.uid;
    console.log(score + "," + uid);
    if(!score || !uid) {
        res.status(500);
        res.end('request body is incomplete');
        return;
    }

    let obj = {
        score: score,
        uid: uid
    };

    let query = {
        where: {
            uid: uid
        }
    };
    let record = await models.scores.findOne(query);

    if(uid == 'NoName' || !record) {
        record = await models.scores.create(obj);
    } else {
        let oldScore = record.getDataValue('score');
        if(Number(oldScore) < Number(score)) {
            obj = { score: score};
            await record.update(obj);
        } 
    }

    res.status(200);
    res.end();
});

module.exports = router;
