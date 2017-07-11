var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var request = require('request');
var config = require("./config");
var fs = require('fs');
var myFile = require("./myFile.json");
var oauth2 = require('salesforce-oauth2');
app.use(bodyParser.json());
let jsforce = require('jsforce');
let conn = new jsforce.Connection({});




// ------------------------------------------------injecting an apex trigger---------------------------------------------------------
var express = require('express');
var router = express.Router();

var Ifield = myFile.Ifield;
var licensecode = myFile.licensecode;

var trigger1_body = fs.readFileSync('Trigger1.apex', 'utf8');
var trigger2_body = fs.readFileSync('Trigger2.apex', 'utf8');

var trigger3_body = fs.readFileSync('Trigger3.apex', 'utf8');
trigger3_body = trigger3_body.replace(/IfieldVar/, Ifield);
trigger3_body = trigger3_body.replace(/licensecodeVar/, licensecode);
trigger3_body = trigger3_body.replace(/IfieldVar/, Ifield);

inject = function(code, accesstoken, Ifield, licensecode, response) {
    console.log('WILL INJECT TRIGGERS NOW' + accesstoken)
    payload = []
    payload1 = {
        "Name": "Trigger1",
        "TableEnumOrId": "Lead",
        "Body": trigger1_body
    }
    payload.push(payload1)
    payload2 = {
        "Name": "Trigger2",
        "TableEnumOrId": "Contact",
        "Body": trigger2_body
    }
    payload.push(payload2);
    payload3 = {
        "Name": "Trigger3",
        "TableEnumOrId": "Lead",
        "Body": trigger3_body
    }
    payload.push(payload3);
    InjectRequest(payload, code, accesstoken, Ifield, licensecode, 0, payload.length, response);
    return 1;
}


function InjectRequest(payload, code, accesstoken, Ifield, licensecode, index, total, response) {
    if (index < total) {
        setTimeout(function() {
            console.log("TRYING TO INJECT APEX TRIGGER " + index);
            request.post({
                url: 'https://ap5.salesforce.com/services/data/v27.0/sobjects/ApexTrigger',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accesstoken
                },
                body: JSON.stringify(payload[index]),
            }, function(err, res, body) {
                if (err) {
                    return InjectRequest(payload, accesstoken, Ifield, licensecode, apikey, index, total, response);
                    throw err;
                } else {
                    console.log('TRIGGER Injected ' + index)
                    console.log(body)
                    return InjectRequest(payload, code, accesstoken, Ifield, licensecode, index + 1, total, response);
                }
            });
        }, 100);
    } else {
        response.redirect('/done');
    }
}

module.exports = {
    inject
}