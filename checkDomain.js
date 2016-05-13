var B = require('bluebird');
var superagent = require('superagent');
var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');
var URI = require('uri-js');
var _ = require('lodash');
var htmlparser = require("htmlparser2");
var R = require("ramda");
var robotparser = require("robots");

// Override the default behavior of superagent, which encodes to UTF-8.
var _parse = function(res, done) {
    res.text = '';
    res.setEncoding('binary');
    res.on('data', function(chunk) { res.text += chunk; });
    res.on('end', done);
};

function urlsToValidate(url, packageName, appStoreId){

    urlParts = dissectUrl(url);
    urlParts.packageName = packageName;
    urlParts.appStoreId = appStoreId;
    return urlParts;
}

function dissectUrl(url){
    
    var urlParts = {};
    var splitOnForwardSlash = url.split("/");
    var domain = null;
    var whereToLook = -1;
    
    if(url.indexOf('http') != -1) { 
        urlParts.protocol = url.substring(0, url.indexOf('://')); 
        if(splitOnForwardSlash.length > 1 ){ urlParts.domain = splitOnForwardSlash[2]; whereToLook = 2; }
        
    }else{ 
        urlParts.domain = splitOnForwardSlash[0]; 
        whereToLook = 0;
    }

    if(urlParts.domain.split('.').length > 2){
        domainSubdomainParts = urlParts.domain.split('.');
        urlParts.subdomain = domainSubdomainParts[0];
        urlParts.domain = domainSubdomainParts[1] + '.' + domainSubdomainParts[2];
    }

    if(urlParts.protocol!=='http' && urlParts.protocol!=='https') { urlParts.protocol = 'http'; }

    if(urlParts.subdomain == undefined) protocolPlusDomain = urlParts.protocol + '://' + urlParts.domain;

    else protocolPlusDomain = urlParts.protocol + '://' + urlParts.subdomain + '.' + urlParts.domain;   
    
    urlParts.assetLinks = protocolPlusDomain + '/.well-known/assetlinks.json';
    urlParts.robots = protocolPlusDomain + '/robots.txt';

    if(url.indexOf('.xml')!=-1){
        urlParts.sitemap = assembleCleanUrl(urlParts, whereToLook, splitOnForwardSlash);
        urlParts.webpage = '';
    } else{ 
        urlParts.webpage = assembleCleanUrl(urlParts, whereToLook, splitOnForwardSlash); 
        urlParts.sitemap = '';
    }
    
    return urlParts;
}

function assembleCleanUrl(urlParts, whereToLook, splitOnForwardSlash){
    var cleanUrl = urlParts.protocol + '://';
    
    for(var i = whereToLook; i < splitOnForwardSlash.length; i++){
        cleanUrl += splitOnForwardSlash[i] + '/';
    }
    
    return cleanUrl;
}

function vRobots(assetLocations){
    return new B(function(resolve, reject) {

        var robots = {};
        robots.breakingError = true;
        robots.invalidUserAgent = true;
        robots.location = assetLocations.robots;
       
        parser = new robotparser.RobotsParser();

        parser.setUrl(assetLocations.robots, function(parser, success) {
            if(success) {
                robots.breakingError = false;

                var wholePath = String(assetLocations.webpage);
                var protocolPlusDomain = assetLocations.protocol + ':\/\/' + assetLocations.domain;
                var specificPath = wholePath.replace(protocolPlusDomain, '');

                parser.canFetch('googlebot', specificPath, function (access) {
                    if (access) {
                        //testResults.robots.invalidUserAgent = false;
                        robots.invalidUserAgent = false;
                    } else {
                        robots.invalidUserAgent = true;
                    }
                    resolve(robots);
                });
            }else{
                resolve(robots);
            }
        });
    });
}

function vHead(assetLocations){
    return new B(function(resolve, reject){
        var webpage = {}
        webpage.location = assetLocations.webpage;
        webpage.breakingError = false
        webpage.invalidAndroidScheme = true;
        webpage.invalidiOSScheme = true;
        webpage.invalidAndroidHost =true;
        webpage.invalidiOSHost = true;
        webpage.location = assetLocations.webpage;

        var androidHost = assetLocations.packageName;
        var iOSHost = assetLocations.appStoreId;

        superagent.get(assetLocations.webpage).timeout(3000).buffer().parse().end(function(err, res) {
            if(err && !res) { 
                webpage.breakingError = true; 
            }
            else{
                var linkFound = false;
                var parser = new htmlparser.Parser({
                    onopentag: function(name, attribs){
                        if(name == 'link' && attribs.rel === 'alternate' && typeof attribs.href ==='string'){

                            var parsedURI= URI.parse(attribs.href);

                            if(parsedURI.scheme === 'android-app') {
                                webpage.invalidAndroidScheme = false;
                                if(parsedURI.host === androidHost.toLowerCase()){
                                    webpage.invalidAndroidHost = false;
                                }
                            }
                            if(parsedURI.scheme === 'ios-app') {
                                var parsedURI= URI.parse(attribs.href);
                                webpage.invalidiOSScheme = false;
                                if(parsedURI.host === iOSHost){
                                    webpage.invalidiOSHost = false;
                                }
                            }
                        }
                    }
                },  
                { decodeEntities: true });
                parser.write(res.text);
                parser.end();
                }
                resolve(webpage);
            });
        });
}

function vAssetlinks(assetLocations){

    return new B(function(resolve, reject){
        var assetlinks = {}
        assetlinks.location = assetLocations.assetLinks;
        assetlinks.packageName = assetLocations.packageName;
        assetlinks.assetlinkFileNotFound = false;
        assetlinks.breakingError = false;
        assetlinks.serverError = false;
        assetlinks.badContentType = false;

        assetlinks.assetlinkFileNotFound = false;
        assetlinks.invalidPackageName = true;
        assetlinks.invalidJSON = false;
        assetlinks.invalidRelation = true;
        assetlinks.invalidNamespace = true;
        assetlinks.invalidSHA = true;
        
        superagent.get(assetLocations.assetLinks).timeout(3000).buffer().parse(_parse).end(function(err, res) {

            if (err && !res){
                assetlinks.breakingError = true;
            } 
            else {

                assetlinks.serverError = false;
                assetlinks.badContentType = false;

                var isValidMimeType = res.headers['content-type'].indexOf('application/json') > -1;
                if (res.status >= 400) {
                    assetlinks.serverError = true;
                } else if (!isValidMimeType) {
                    assetlinks.badContentType = true;
                }

                if (!assetlinks.breakingError) {

                    try{
                        var domainApplinks = JSON.parse(res.text);
                    }catch(err){
                        assetlinks.invalidJSON = true;
                    }

                    var assetlinksStmts = [];

                    var stmt_count = 0;

                    _.forEach(domainApplinks,function(stmt){

                        if(stmt.hasOwnProperty("target") && stmt.target.hasOwnProperty("package_name") && stmt.target.package_name===assetLocations.packageName){

                            stmt_count = stmt_count + 1;

                            assetlinksStmts.push(stmt);

                            if(stmt.hasOwnProperty("relation") && (stmt.relation instanceof Array)) assetlinks.invalidRelation = false;
                            
                            if(stmt.target.hasOwnProperty("namespace") && stmt.target.namespace==='android_app') assetlinks.invalidNamespace = false;
                            
                            if(stmt.target.hasOwnProperty("sha256_cert_fingerprints") && (stmt.target.sha256_cert_fingerprints instanceof Array)) assetlinks.invalidSHA = false;        

                        }

                    });

                    assetlinks.invalidPackageName = stmt_count == 0;

                }
            }
            resolve(assetlinks);
        });
});
}

function _checkDomain(url, packageName, appStoreId) {

    var assetLocations = urlsToValidate(url, packageName, appStoreId);
    
    var tResults = {};
    return new B(function(resolve, reject) {
        return B.all([
            
            vHead(assetLocations),
            vRobots(assetLocations),
            vAssetlinks(assetLocations)

        ]).spread(function(resultsFromVHead, resultsFromVRobots, resultsFromVAssetlinks){

            var testResults = {};
            testResults.webpage = resultsFromVHead;
            testResults.robots = resultsFromVRobots;
            testResults.assetlinks = resultsFromVAssetlinks;

            resolve({testResults:testResults});
        });
    });
}

module.exports = _checkDomain;
