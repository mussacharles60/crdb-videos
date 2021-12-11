var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser') // For Express version less than 4.16.0
var path = require('path');

const port = process.env.PORT || "80";

var app = express();

app.use(cookieParser());
app.use(express.json()); // For Express v4.16.0 and higher
app.use(bodyParser.urlencoded({ extended: true })); +
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

var server = app.listen(port, function() {
    //var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://localhost:" + port)
});