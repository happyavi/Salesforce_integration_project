var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var config = require('./config');
var components = require('components');
var oauth2 = require('salesforce-oauth2');
app.use(bodyParser.json());

let jsforce = require('jsforce');
let conn = new jsforce.Connection({});
var moment = require('moment');

var express = require('express');
var router = express.Router();
//--------------------------------------------------------Handle triggered data -------------------------------------------------------


callwebengagecontacts = function(payload, licensecode) {
    request.post({
        url: 'https://api.webengage.com/v1/accounts/' + licensecode + '/users',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + config.connection.apikey,
            'Accept': 'text/plain'
        },
        body: JSON.stringify(payload),
    }, function(err, res, body) {
        if (err) throw err;
        console.log(body)
    });
}

function callwebengageevents(payload, licensecode) {
    request.post({
        url: 'https://api.webengage.com/v1/accounts/' + licensecode + '/events',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + config.connection.apikey,
            'Accept': 'text/plain'
        },
        body: JSON.stringify(payload),
    }, function(err, response, body) {
        if (err) throw err;
        console.log(body)
    });

}
router.post('/', function(req, res) {
    console.log(req.body)
    mainstrings = ["Id", "FirstName", "LastName", "email", "MobilePhone"];
    idlist = req.body["identifiers"];
    req.body = req.body["allvalues"];
    console.log(idlist);
    console.log(req.body);
    var payload = {
        'userId': req.body[idlist['field']],
        'firstName': req.body["FirstName"],
        'lastName': req.body["LastName"],
        'email': req.body["Email"],
        'phone': req.body["MobilePhone"]
    }
    var otherattributes = {};
    for (var key in req.body) {
        if (!(mainstrings.includes(key))) {

            otherattributes[key] = req.body[key];
        }
    }
    payload['attributes'] = otherattributes;
    console.log(payload);
    callwebengagecontacts(payload, idlist['licensecode']);
    if (idlist['type'] == 'Lead') {
        //Log lead added event 
        eventpayload = {}
        eventpayload['userId'] = req.body[idlist['field']];
        eventpayload['eventName'] = 'Lead Added';
        eventpayload['eventData'] = otherattributes;
        callwebengageevents(eventpayload, idlist['licensecode']);
    } else if (idlist['type'] == 'Contact') {
        //Log contact added event 
        eventpayload = {}
        eventpayload['userId'] = req.body[idlist['field']];
        eventpayload['eventName'] = 'Contact Added';
        eventpayload['eventData'] = otherattributes;
        callwebengageevents(eventpayload, idlist['licensecode']);
    }

});


function getTypeOfData(dataToDetectTypeOf) {

    var formats = [
        moment.ISO_8601,
        "MM-DD-YYYY HH:mm:ss"
    ];

    if (!isNaN(dataToDetectTypeOf)) {
        return "number";
    } else if (moment(dataToDetectTypeOf, formats, true).isValid()) {
        return "date";
    } else if (dataToDetectTypeOf === 'true' || dataToDetectTypeOf === 'false') {
        return "boolean";
    } else {
        return "string";
    }

}

router.post('/update', function(req, res) {
    mainstrings = ["Id", "firstname", "lastname", "email", "phone"];

    var data = req.body;
    var licensecode = data[data.length - 1]["licensecode"]
    var Ifield = data[data.length - 1]["field"]
    for (var i = 0; i < data.length - 1; i++) {
        var d = data[i];
        //Update lead

        var payload = {
            'userId': d["Id"]
        }
        if (mainstrings.includes(d["Attribute"])) payload[d["Attribute"]] = d["NewValue"];
        else {
            var payload1 = {};
            payload1[d["Attribute"]] = d["NewValue"];
            payload["attributes"] = payload1;
        }
        console.log(payload)
        callwebengagecontacts(payload, licensecode);
        //Log events
        var options = {
            'userId': d["Id"],
            //'eventName': '',
            'eventData': {
                'Attribute': d["Attribute"],
                'Name': d["Name"]
            }
        }
        if (options.eventData.Attribute === 'status') {
            options.eventName = 'Lead status Changed';
        } else if (options.eventData.Attribute === 'rating') {
            options.eventName = 'Lead rating Changed';
        } else if (options.eventData.Attribute === 'email') {
            options.eventName = 'Lead email Changed';
        } else if (options.eventData.Attribute === 'isconverted') {
            options.eventName = 'Lead converted';
        } else {
            options.eventName = 'Lead attribute Changed';
        }

        var dataType;
        if (d["OldValue"] === null) {
            dataType = getTypeOfData(d["NewValue"]);
        } else {
            dataType = getTypeOfData(d["OldValue"]);
        }
        var oldKey = null;
        var newKey = null;
        switch (dataType) {

            case "string":
                oldKey = 'OldValueString';
                newKey = 'NewValueString';
                options.eventData[oldKey] = d["OldValue"];
                options.eventData[newKey] = d["NewValue"];
                break;
            case "date":
                oldKey = 'OldValueDate';
                newKey = 'NewValueDate';
                options.eventData[oldKey] = d["OldValue"];
                options.eventData[newKey] = d["NewValue"];
                break;
            case "number":
                oldKey = 'OldValueNumber';
                newKey = 'NewValueNumber';
                options.eventData[oldKey] = Number(d["OldValue"]);
                options.eventData[newKey] = Number(d["NewValue"]);
                break;
            case "boolean":
                oldKey = 'OldValueBoolean';
                newKey = 'NewValueBoolean';
                options.eventData[oldKey] = Boolean(d["OldValue"]);
                options.eventData[newKey] = Boolean(d["NewValue"]);
                break;
            default:
                oldKey = 'OldValueString';
                newKey = 'NewValueString';
                options.eventData[oldKey] = d["OldValue"];
                options.eventData[newKey] = d["NewValue"];
        }
        options.eventData[oldKey] = d["OldValue"];
        options.eventData[newKey] = d["NewValue"];
        console.log(options);
        callwebengageevents(options, licensecode);
    }
});
module.exports = {
    router: router,
    callwebengagecontacts: callwebengagecontacts
}