var express = require('express');
var app = express();
var fs = require("fs");
var zlib = require("zlib");

app.set("view engine", "jade");
app.set('views', __dirname);
app.use(express.static(__dirname + '/public'));

// app.register('.html', require('jade'));

app.get('/', function (req, res) {
    res.render("index.jade");
})


app.get("/file1.json", function (req, res, next) {
    fs.readFile("file1.json", function(err, content) {
        if (err) {
            return next(err);
        }
        zlib.gzip(content, function(err, zipResult) {
            if (err) {
                return next(err);
            }
            console.log("send: " + zipResult.length);
            res.setHeader('Content-Length', zipResult.length);
            res.setHeader('Content-Type', 'application/zip');
            res.end(zipResult);
        })
    });
});


app.get("/file2.json", function (req, res, next) {
    fs.readFile("file2.json", function(err, content) {
        if (err) {
            return next(err);
        }
        zlib.gzip(content, function(err, zipResult) {
            if (err) {
                return next(err);
            }
            console.log("send: " + zipResult.length);
            res.setHeader('Content-Length', zipResult.length);
            res.setHeader('Content-Type', 'application/zip');
            res.end(zipResult);
        })
    });
});




var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
