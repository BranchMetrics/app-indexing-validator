var path = require('path');
var fs = require('fs');
var express = require('express');
var superagent = require('superagent');
var multer  = require('multer');
var plist = require('plist');
var extract = require('extract-zip');
var B = require('bluebird');
var checkDomain = require('./checkDomain');
var config = require('./config');
var childProcess = require('child_process');

var port = process.env.PORT || config.server.port || 3000;
var app = express();

app.use('/resources/app-indexing/static', express.static('static'));
app.use('/resources/app-indexing', express.static('static'));
app.post('/resources/app-indexing/validate-app/', function (httpReq, httpResp) {
    
    var respObj = { domains: { } };

    return checkDomain(httpReq.query.url, httpReq.query.packageName, httpReq.query.appStoreId)
        .then(function(results) {
            httpResp.status(200).json(results);
        });
});

var server = app.listen(port, function() {
    console.log('Server running on port ' + port);
});
