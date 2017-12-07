const express = require('express');
const router = express.Router();

let validateToken = require('./validate_token')
let test = require('./test')
let getAccessToken = require('./config/get_access_token')
// let wechat = require('./config/wechat');

router.get('/', function (req, res) {
    res.send('GET request to the homepage');
});

router.get('/vt', validateToken);
router.get('/test', test);
router.get('/getaccesstoken', getAccessToken);


module.exports = router

