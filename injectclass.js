var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var request = require('request');
var fs = require('fs');
var config = require("./config");
var myFile = require("./myFile.json");
var oauth2 = require('salesforce-oauth2');
app.use(bodyParser.json());

let jsforce = require('jsforce');
let conn = new jsforce.Connection({});



var apextrigger = require('./injecttrigger')
//----------------------------------------------------injecting an apex class--------------------------------------------------------
var express = require('express')
var router = express.Router();

Classrequest = function(payload, code, accesstoken, Ifield, licensecode, index, total, response) {
    if (index < total) {
        setTimeout(function() {
            console.log("TRYING TO INJECT APEX CLASS " + index);
            request.post({
                url: 'https://ap5.salesforce.com/services/data/v27.0/sobjects/ApexClass',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accesstoken,
                },
                body: JSON.stringify(payload[index]),
            }, function(err, res, body) {
                if (err) {
                    return Classrequest(payload, accesstoken, Ifield, licensecode, index, total, response);
                } else if (index == total - 1) {
                    console.log('Class Injected' + index);
                    console.log('Classes Injection completed');
                    console.log(body);
                    return apextrigger.inject(code, accesstoken, Ifield, licensecode, response);
                } else {
                    console.log('Class Injected' + index);
                    console.log(body);
                    return Classrequest(payload, code, accesstoken, Ifield, licensecode, index + 1, total, response);
                }

            })
        }, 100);
    }
}
var endPoint = config.connection.localEndPoint;
var Ifield = myFile.Ifield;
var licensecode = myFile.licensecode;

var class1_body = fs.readFileSync('Class1.apex', 'utf8');
class1_body = class1_body.replace(/localEndPointVar/, endPoint);
class1_body = class1_body.replace(/IfieldVar/, Ifield);
class1_body = class1_body.replace(/licensecodeVar/, licensecode);

var class2_body = fs.readFileSync('Class2.apex', 'utf8');
class2_body = class2_body.replace(/localEndPointVar/, endPoint);

var class3_body = fs.readFileSync('Class3.apex', 'utf8');

var class4_body = fs.readFileSync('Class4.apex', 'utf8');

inject = function(code, accesstoken, Ifield, licensecode, response) {
    payload = [];
    console.log('WILL INJECT CLASS NOW ' + accesstoken)
    payload1 = {
        "Name": "Class1",
        "Body": class1_body
    }
    payload.push(payload1);

    payload2 = {
        "Name": "Class2",
        "Body": class2_body
    }
    payload.push(payload2);

    payload3 = {
        "Name": "Class3",
        "Body": class3_body
    }
    payload.push(payload3);

    payload4 = {
        "Name": "Class4",
        "Body": class4_body
    }
    payload.push(payload4);
    Classrequest(payload, code, accesstoken, Ifield, licensecode, 0, payload.length, response);
}

module.exports = {
    inject
}