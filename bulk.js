var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var request = require('request');
var oauth2 = require('salesforce-oauth2');
app.use(bodyParser.json());
var router = express.Router()
let jsforce = require('jsforce');
let conn = new jsforce.Connection({
    version: '27.0'
});
var fs = require('fs');
var QueryStrings = {}
var querystrings = require('./Fields.json')
var Webengage = require('./handle.js')

function GenerateNewQueryStrings(conn, fullName) {
    var fieldlist = {}
    conn.sobject(fullName).describe(function(err, meta) {
        if (err) {
            return console.error(err);
        }
        console.log(meta)
        key = fullName
        var objectlist = []
        for (var j = 0; j < meta['fields'].length; j++) {
            if (meta['fields'][j]['type'] != 'location' && meta['fields'][j]['type'] != 'address')
                objectlist.push(meta['fields'][j]['name'])
        }
        fieldlist[key] = objectlist
        var newquery = ''
        for (var i = 0; i < fieldlist[key].length - 1; i++) newquery = newquery + fieldlist[key][i] + ',';
        newquery = newquery + fieldlist[key][fieldlist[key].length - 1];
        QueryStrings[key] = newquery;
        console.log(newquery)
        fs.writeFileSync("Fields.json", JSON.stringify(QueryStrings), "utf8");
    });
}


conn.login('samyak@idontwork.com', 's_sjain@345l0LDZ0saARlOmCsPC9L1OV77', function(err, userInfo) {
    /*conn.login('sam29_jain@hotmail.com','s_sjain@2341JgZshduIDFrKf5my8DtnOaU',function(err,userInfo)
    {
                token = conn.accessToken;
                url = conn.instanceUrl; 
                conn = new jsforce.Connection({
                  instanceUrl : url,
                  accessToken : token,
                  version : '27.0'
                });
                console.log(token)
    //    USE WHEN YOU WANT TO REGENERATE FIELD STRINGS
        var fullNames = [ 'Lead', 'Contact'     ];
        for(var i=0;i<fullNames.length;i++){
               GenerateNewQueryStrings(conn,fullNames[i]); 
        }
        console.log('SELECT ' + querystrings['Lead'] + ' FROM Lead');

        */
    conn.bulk.query('SELECT ' + querystrings['Lead'] + ' FROM Lead').on('record', function(rec) {
        console.log(rec);
        mainstrings = ["Id", "FirstName", "LastName", "Email", "MobilePhone"];
        var payload = {
            'userId': rec["Id"],
            'firstName': rec["FirstName"],
            'lastName': rec["LastName"],
            'email': rec["Email"],
            'phone': rec["MobilePhone"]
        }
        var otherattributes = {};
        for (var key in rec) {
            if (!(key in mainstrings)) {

                otherattributes[key] = rec[key];
            }
        }
        payload['attributes'] = otherattributes;
        Webengage.callwebengagecontacts(payload);
    }).on('error', function(err) {
        console.error(err);
    });


    conn.bulk.query('SELECT ' + querystrings['Contact'] + ' FROM Contact').on('record', function(rec) {
        console.log(rec);
        mainstrings = ["Id", "FirstName", "LastName", "Email", "MobilePhone"];
        var payload = {
            'userId': rec["Id"],
            'firstName': rec["FirstName"],
            'lastName': rec["LastName"],
            'email': rec["Email"],
            'phone': rec["MobilePhone"]
        }
        var otherattributes = {};
        for (var key in rec) {
            if (!(key in mainstrings)) {

                otherattributes[key] = rec[key];
            }
        }
        payload['attributes'] = otherattributes;
        Webengage.callwebengagecontacts(payload);
    }).on('error', function(err) {
        console.error(err);
    });
    //.stream().pipe(fs.createWriteStream('./accounts.csv'));
    module.exports = router;
});