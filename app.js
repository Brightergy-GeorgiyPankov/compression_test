var _ = require("lodash"),
    fs = require("fs"),
    async = require("async"),
    zlib = require("zlib"),
    jsonpack = require("jsonpack"),
    jsoncomp = require("jsoncomp"),
    pako = require("pako");


console.log("Compression test")

var zlibTest = function(fileName, callback) {

    console.time("zlibTest." + fileName);

    var content = fs.readFile(fileName, function(err, content) {
        if (err) {
            return callback(err);
        }
        zlib.gzip(content, function(err, compressed) {
            if (err) {
                return callback(err);
            }
            console.log("content: " + content.length + ", compressed: " + compressed.length);
            console.timeEnd("zlibTest." + fileName);
            callback();
        });
    });
}


// json pack
var jsonpackTest = function(fileName, callback) {

    console.time("jsonTest." + fileName);
    var content = fs.readFile(fileName, function(err, content) {
        if (err) {
            return callback(err);
        }
        var compressed = jsonpack.pack(content);
        console.log("content: " + content.length + ", compressed: " + compressed.length);
        console.timeEnd("jsonTest." + fileName);
        callback();
    });
}


// json compress (not really a compress)
var jsonCompressTest = function(fileName, callback) {
    console.time("jsonCompress." + fileName);
    var content = fs.readFile(fileName, function(err, content) {
        if (err) {
            return callback(err);
        }
        var compressed = jsoncomp.compress(content);
        // var compressed = jsoncomp.pack(content); do not working
        console.log("content: " + content.length + ", compressed: " + compressed.length);
        console.timeEnd("jsonCompress." + fileName);
        callback();
    });
}


// packo
var pakoTest = function(fileName, callback) {
    console.time("pako." + fileName);
    var content = fs.readFile(fileName, function(err, content) {
        if (err) {
            return callback(err);
        }
        var binData = new Uint8Array(content);
        var compressed = pako.deflate(content);
        console.log("content: " + content.length + ", compressed: " + compressed.length);
        console.timeEnd("pako." + fileName);
        callback();
    });
}



async.waterfall([
        function(next) {
            zlibTest("file1.json", next);
        },
        function(next) {
            zlibTest("file2.json", next);
        },
        function(next) {
            jsonCompressTest("file1.json", next);
        },
        function(next) {
  //          jsonpackTest("file1.json", next);
            next();
        },
        function(next) {
            pakoTest("file1.json", next);
        },
        function(next) {
            pakoTest("file2.json", next);
        }

    ],
    function(err) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
    }
);
