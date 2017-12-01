var express = require('express')
var app = express();
// var router = express.Router();
var validateToken = require('./validateToken')
// var wechat = require('./config/wechat');

// 用于请求获取access_token
// var wechatApp = new wechat(config);
// router.get('/getAccessToken', function (req, res) {
//     wechatApp.getAccessToken().then(function (data) {
//         res.send(data);
//     });
// });

app.get('/', function (req, res) {
    res.send('GET request to the homepage');
});


console.log(validateToken)
app.use('/vt', validateToken);

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

