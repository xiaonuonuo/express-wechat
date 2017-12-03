const qs = require('querystring');
const request = require('request');
const fs = require('fs');

//保存与更新
// let wechatToken = {

//     awaitToken: function (options) {
//         let _this = this;
//         return new Promise((resolve, reject) => {
//             let currentTime = new Date().getTime();   // 获取当前的时间戳
//             let accessTokenJson = _this.getToken()
//             console.log(accessTokenJson)
//             // 判断本地存储的access_token是否有效
//             if (accessTokenJson.access_token === '' || accessTokenJson.expires_time < currentTime) {
//                 request(options, function (err, res, body) {
//                     var result = JSON.parse(body);
//                     if (!err) {   // 成功
//                         accessTokenJson.access_token = result.access_token;
//                         accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
//                         fs.writeFile('./access_token.json', JSON.stringify(accessTokenJson));  // 更新本地存储access_token和expires_time
//                         resolve(accessTokenJson.access_token);   // 返回本地存储的access_token
//                     } else {   // 失败
//                         resolve(result);   // 将错误返回
//                     }

//                     // if (res) {
//                     //     resolve(JSON.parse(body));
//                     // } else {
//                     //     reject(err);
//                     // }
//                 });
//             } else {
//                 resolve(accessTokenJson.access_token);   // 返回本地存储的access_token
//             }
//         })
//     },

//     getToken: function () {
//         let _this = this
//         fs.readFile(__dirname + '/access_token.json', { flag: 'r+', encoding: 'utf8' }, function (err, res) {
//             if (!err) {
//                 // that.setToken(res)
//                 console.log(res)
//                 return res
//             } else {
//                 console.log(err)
//             }
//         })
//     },

//     setToken: function (data,token) {
//         let dataJson = JSON.parse(data)
//         dataJson.access_token = token
//         fs.writeFile(__dirname + '/access_token.json', JSON.stringify(dataJson), function (err) {
//             if (!err) {
//                 console.log('写入成功')
//                 console.log(dataJson)
//             } else {
//                 console.log(err)
//             }
//         })
//     }
// }




let wechatToken = {

    awaitToken: async function (options) {
        let currentTime = new Date().getTime();   // 获取当前的时间戳
        let accessTokenJson = await this.getToken()
        console.log(accessTokenJson)
        // 判断本地存储的access_token是否有效
        if (accessTokenJson.access_token === '' || accessTokenJson.expires_time < currentTime) {
            return await this.resquest(options);
        } else {
            return accessTokenJson.access_token;   // 返回本地存储的access_token
        }
    },
    resquest: function (options) {
        return new Promise((resolve, reject) => {
            request(options, function (err, res, body) {
                var result = JSON.parse(body);
                if (!err) {   // 成功
                    accessTokenJson.access_token = result.access_token;
                    accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                    fs.writeFile('./access_token.json', JSON.stringify(accessTokenJson));  // 更新本地存储access_token和expires_time
                    resolve(accessTokenJson.access_token);   // 返回本地存储的access_token
                } else {   // 失败
                    reject(err);
                }

                // if (res) {
                //     resolve(JSON.parse(body));
                // } else {
                //     reject(err);
                // }
            });
        });
    },
    getToken: function () {
        return new Promise((resolve, reject) => {
            fs.readFile(__dirname + '/access_token.json', { flag: 'r+', encoding: 'utf8' }, (err, res) => {
                if (!err) {
                    // this.setToken(res)
                    console.log(res)
                    resolve(res)
                } else {
                    reject(err);
                }
            })
        })

    },

    setToken: function (data, token) {
        var dataJson = JSON.parse(data)
        dataJson.access_token = token
        fs.writeFile(__dirname + '/access_token.json', JSON.stringify(dataJson), function (err) {
            if (!err) {
                console.log('写入成功')
                console.log(dataJson)
            } else {
                console.log(err)
            }
        })
    }
}



getAccessToken = async function (req, res, next) {
    let config = {
        appId: 'wx4b1e5e809cf26a5d',
        appSecret: '09cf424f51846a4ab4bd2d5a4b45a8d1'
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
    let result = await wechatToken.awaitToken(options)
    if (result) {
        res.send(result)
    } else {
        res.send('something err')
    }
},




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

