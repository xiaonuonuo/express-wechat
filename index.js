var express = require('express')
var app = express();
// var router = express.Router();
var validateToken = require('./validate_token')
// var test = require('./test')
var getAccessToken = require('./config/get_access_token')
// var wechat = require('./config/wechat');

app.get('/', function (req, res) {
    res.send('GET request to the homepage');
});

app.use('/vt', validateToken);
// app.use('/testapi', test);
app.get('/getaccesstoken', getAccessToken);

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

