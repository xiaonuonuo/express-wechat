const fs = require('fs');   //请求fs文件系统模块

wToken = {
    //access_token保存
    getToken: function () {
        return new Promise((resolve, reject) => {
            fs.readFile(__dirname + '/access_token.json', { flag: 'r+', encoding: 'utf8' }, (err, res) => {
                if (!err) {
                    // this.setToken(res)
                    console.log(res+'    ---------- data ---------')
                    resolve(JSON.parse(res))
                } else {
                    reject('err');
                }
            })
        })

    },

    //access_token更新
    setToken: function (result) {
        return new Promise((resolve, reject) => {
            this.getToken().then((data) => {
                data.timestamp = result.timestamp  //生成签名的时间戳
                data.nonce = result.nonce //生成签名的随机数
                data.signature = result.signature //微信加密签名,
                data.echostr = result.echostr //随机字符串,
                fs.writeFile(__dirname + '/access_token.json', JSON.stringify(data), function (err) {
                    if (!err) {
                        console.log('写入成功')
                        resolve('success')
                        // console.log(data)
                    } else {
                        console.log(err)
                    }
                })
            })
        })
    }
}

module.exports = wToken