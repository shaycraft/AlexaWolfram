/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions a.e located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
const SKILL_NAME = "Ask Wolfram";
var parseString = require('xml2js').parseString;

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'You did not ask a question you <say-as interpret-as="expletive">fucking</say-as> imbecile');
    },
    'questionintent': function() {
        
        var questionEncoded = encodeURIComponent(this.event.request.intent.slots.catchall.value);
        var http = require('http');
        var url = "http://api.wolframalpha.com/v2/query?input=" + questionEncoded + "&appid=VH52VT-7EHJTL4UU3";
        
        var speechOutput = 'blah blah blah you ' + this.event.request.intent.slots.catchall.value;
        var tmpThis = this;
        
        console.log('url = ');
        console.log(url);
        http.get(url, function(res) {
            var resString = '';
            console.log("Got response: " + res.statusCode);
            //console.log(res);
            //this.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput);

            res.on('data', function(data) {
                resString += data;
            });
            res.on('end', function() {
                parseString(resString, function (err, result) {
                    console.log('xml result = ');
                    //console.log(result.queryresult);
                    console.log(result.queryresult.pod[0].subpod[0].plaintext[0]);
                    speechOutput = result.queryresult.pod[0].subpod[0].plaintext[0]; 
                    tmpThis.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput);
                    //tmpThis.emit(':tellWithCard', 'This is shitty', SKILL_NAME, 'This is shitty');
                });
            });

        }).on('error', function(e) {
            console.log("Got error: " + e.message);
            tmpThis.emit(':ask', 'Received error from Wolfram api');
        });
        
        /*console.log(encodeURIComponent(this.event.request.intent.slots.catchall.value)); 
        var speechOutput = 'blah blah blah you ' + this.event.request.intent.slots.catchall.value;
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, speechOutput);*/
    },
    'Unhandled': function() {
        this.emit(':ask', 'You did not ask a question you <say-as interpret-as="expletive">fucking</say-as> retard');
        //this.emit(':ask', 'You did not ask a question.');
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
};
