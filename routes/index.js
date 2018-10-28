var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/score', async function(req, res, next) {
    let query = {
        order: [['score', 'DESC']],
        limit: 10
    };
    let records = await models.scores.findAll(query);
    let objects = [];

    for(record of records) {
        let uid = record.getDataValue('uid');
        let score = record.getDataValue('score');
        console.log(uid + "," + score);
        objects.push({
            uid: uid,
            score: score
        });
    }

    res.render('scores', { scores: objects});
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
