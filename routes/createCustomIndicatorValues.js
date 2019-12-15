var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('client-sessions');
var path = require("path");

var app = express();

var config = require('../config.js');

app.use(session({
    cookieName: 'session',
    secret: config.secret,
    expires: new Date(Date.now() + (config.expires))
}));

router.post('/', function(req, res){
    let id = JSON.parse(req.body.responseFromServer).id;

    if (req.session && req.session.user) {
        for(let indicatorIndex in req.body.indicatorValues) {
            let type;
            switch (req.body.indicatorValues[indicatorIndex].type) {
                case 'boolean':
                    type = 1;
                    break;
                default:
                    type = 0;
                    break;
            }
            query = "CALL createIndicatorValue('" + req.body.indicatorValues[indicatorIndex].name + "', " + id + ", " + type + ");";

            connection = mysql.createConnection({
                host: config.rdsHost,
                user: config.rdsUser,
                password: config.rdsPassword,
                database: config.rdsDatabase
            });

            connection.connect();
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    // res.status(200).json({rows});
                    // res.end();
                } else {
                    console.log('Error while performing Query.');
                    console.log(query);
                    console.log(err.code);
                    console.log(err.message);
                }
            });
            connection.end();
        }
        res.status(200);
        res.end();
    } else {
        console.log("not logged in");
    }
});

module.exports = router;
