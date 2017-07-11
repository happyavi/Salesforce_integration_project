var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var request = require('request');
var config = require("./config");
var oauth2 = require('salesforce-oauth2');
var oauth = require('./oauth1');
app.use(bodyParser.json());

let jsforce = require('jsforce');

var apexclass = require('./injectclass');

var express = require('express')
var router = express.Router()

inject = function(code, Ifield, licensecode, accesstoken, response) {
        console.log('Remote Site Injected');
        apexclass.inject(code, accesstoken, Ifield, licensecode, response);
    }

module.exports.inject = inject;