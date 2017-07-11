var express = require('express');
var router = express.Router();
var config = require("./config");
var request = require('request');
let jsforce = require('jsforce');

var clientid = config.connection.clientid;
var clientsecret = config.connection.clientsecret;
var callbackurl = config.connection.callbackurl;


var oauth2 = new jsforce.OAuth2({
    clientId: clientid,
    clientSecret: clientsecret,
    redirectUri: callbackurl
});

var accesstoken;
var refreshtoken;
var instanceurl;

router.get("/", function(req, res) {
    res.redirect(oauth2.getAuthorizationUrl({
        scope: 'refresh_token api id web'
    }));
});

router.use('/index', function(req, res) {
    accesstoken = req.query['accesstoken'];
    code = req.query['code'];

    res.render('index', {
        "accesstoken": accesstoken,
        "code": code
    });
});

router.get('/callback', function(req, res) {
    var conn = new jsforce.Connection({
        oauth2: oauth2
    });
    var code = req.param('code');

    conn.authorize(code, function(err, userInfo) {
        if (err) {
            return console.error(err);
        }
        accesstoken = conn.accessToken;
        refreshtoken = conn.refreshToken;
        instanceurl = conn.instanceUrl;
        console.log("access_token: " + accesstoken);
        console.log("refresh_token: " + refreshtoken);
        console.log("Instance_Url" + instanceurl);

        console.log("Authorization granted to use the salesforce platform");

        let metadata = [{
            description: 'WebengageRemoteSite',
            disableProtocolSecurity: 'False',
            fullName: 'WebengageRemoteSite',
            isActive: 'true',
            url: config.connection.localEndPoint
        }];
        conn.metadata.create('RemoteSiteSetting', metadata, function(err, results) {
        if (err) {
            console.log("error in creating metadata", err);
            return console.error(err);

        }
            res.redirect('/index?accesstoken=' + accesstoken + '&code=' + code);
        });
    });
});


// conn = new jsforce.Connection({
//     oauth2: oauth2,
//     instanceurl: instanceurl,
//     accesstoken: accesstoken,
//     refreshtoken: refreshtoken
// });

// conn.on("refresh", function(accesstoken, res) {
//     console.log("New_access_token: " + accesstoken)
//     console.log("Authorizeation granted to use the salesforce platform");
//     global.conn = conn;
//     res.redirect('/index?accesstoken=' + accesstoken + '&code=' + code);
// });

module.exports = router;