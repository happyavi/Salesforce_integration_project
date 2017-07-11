var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');
var config = require("./config");
app.use(bodyParser.json());
app.set("view engine", "ejs");

let jsforce = require('jsforce');
let conn = new jsforce.Connection({});

var site = require('./appandsite');

app.use('/index1', function(req, res) {
    var accesstoken = req.query['accesstoken'];
    var code = req.query['code'];
    res.render('index1', {
        "accesstoken": accesstoken,
        "code": code
    });
});
app.use('/done', express.static('./done.html'))
app.use('/', require('./handle.js').router);
var oauth = require('./oauth1');

app.use('/', oauth);

var Ifield, licensecode;

app.get('/setup', function(req, res) {

    Ifield = req.param('Identifier');
    var accesstoken = req.param('accesstoken');
    var code = req.param('code');
    res.redirect('/index1?accesstoken=' + accesstoken + '&code=' + code);
});
app.get('/setup1', function(req, res) {
    accesstoken = req.query['accesstoken'];
    code = req.query['code'];
    licensecode = req.param('licensecode');

    var fileContent = {
        Ifield : Ifield,
        licensecode : licensecode
    }
    var data = JSON.stringify(fileContent);
    console.log("data:" + data);
    fs.writeFile('./myFile.json', data, function (err,data) {
  
        if (err){
            console.log(err.message);
            return;
        }
    });

    site.inject(code, Ifield, licensecode, accesstoken, res);
});


app.listen(8000, function() {
    console.log('Example app listening on port 8000!')
});
module.exports = app;