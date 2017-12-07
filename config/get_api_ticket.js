/*
 *  Create by CC  2017.12.07 22:27
 */ 

const fs = require('fs');
const request = require('request');
const crypto = require('crypto');
const getAccessToken = require('./get_access_token');

let getJsApiTicket = function(){
    return new Promise((resolve,reject) => {
        getAccessToken().then((data) => {
            let token = JSON.parse(data).access_token;
            let reqUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi';
            let options = {
                method: 'get',
                url: reqUrl
            };
            request(options, function (err, res, body) {
                if (res) {
                    resolve(body);
                } else {
                    reject(err);
                }
            })
        }).catch((err) => {
            throw err
        })
    })
}