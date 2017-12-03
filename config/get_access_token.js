const qs = require('querystring');
const request = require('request');



let awaitToken = function (options){
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            if (res) {
                resolve(JSON.parse(body));
            } else {
                reject(err);
            }
        });
    })
}

let getAccessToken = async function (req,res,next) {
    let config = {
        appId:'wx4b1e5e809cf26a5d',
        appSecret:'09cf424f51846a4ab4bd2d5a4b45a8d1'
    },
        queryParams = {
        'grant_type': 'client_credential',
        'appid': config.appId,
        'secret': config.appSecret
    };

    let wxGetAccessTokenBaseUrl = 'https://api.weixin.qq.com/cgi-bin/token?' + qs.stringify(queryParams);
    let options = {
        method: 'GET',
        url: wxGetAccessTokenBaseUrl
    };

    let result = await awaitToken(options)

    if (result){
        res.send(result)
    }else{
        res.send('something err')
    }
    
};




//保存与更新
let saveToken = function () {
    getAccessToken().then(res => {
        let token = res['access_token'];
        fs.writeFile('./token', token, function (err) {

        });
    })
};

let refreshToken = function () {
    saveToken();
    setInterval(function () {
        saveToken();
    }, 7000 * 1000);
};




// 获取微信access_token
// this.getAccessToken = function () {
//     var that = this;
//     return new Promise(function (resolve, reject) {
//         var currentTime = new Date().getTime();   // 获取当前的时间戳
//         // 判断本地存储的access_token是否有效
//         if (accessTokenJson.access_token === '' || accessTokenJson.expires_time < currentTime) {
//             that.requestGet(url).then(function (data) {
//                 var result = JSON.parse(data);
//                 if (data.indexOf('errcode') < 0) {   // 成功
//                     accessTokenJson.access_token = result.access_token;
//                     accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
//                     fs.writeFile('./access_token.json', JSON.stringify(accessTokenJson));  // 更新本地存储access_token和expires_time
//                     resolve(accessTokenJson.access_token);   // 返回本地存储的access_token
//                 } else {   // 失败
//                     resolve(result);   // 将错误返回
//                 }
//             });
//         } else {
//             resolve(accessTokenJson.access_token);   // 返回本地存储的access_token
//         }
//     });
// }

module.exports = getAccessToken
