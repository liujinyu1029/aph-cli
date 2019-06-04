const request = require('request')
const CLI = require('clui')
const Spinner = CLI.Spinner
const { aphStore } = require('../aph')

module.exports = async (options) => {
    let defaultOpation = {
        url: 'http://xxx.com/api/getData',//要抓取接口的远端地址
        method:'post',
        json: true,
        headers: {
            // "Content-Length":0, // Content-Length最好不要写，用默认值，会自动计算长度
            'content-type': 'application/json',
            'aph_key': aphStore.getAphKey(),// aph-proxy-server 鉴权使用
            // 'aph_key': '5c7f95596fa9b30aac517a53', // aph-proxy-server 鉴权使用
            'x-token': aphStore.getToken(), // aph-web-server 鉴权使用
            'cookie': options.cookie
        },
        body:{}// post参数
    };
    let sp = new Spinner('正在发起请求...')
    return new Promise((resolve,reject)=>{
        sp.start()
        request(Object.assign(defaultOpation, options), function (error, response, data) {            
            sp.stop()
            if (!error) {
                if (response && response.statusCode == 200){
                    // token 失效
                    if(data.ret == 2){
                        aphStore.deleteToken() //删除 token 记录
                        resolve({
                            ret: 0,
                            errMsg: data.message
                        })
                    }else{
                        resolve(data || {
                            ret: 0,
                            errMsg: '远端服务器返回数据为空'
                        })
                    }
                }else{
                    resolve({
                        ret:0,
                        errMsg: 'statusCode - ' + response.statusCode,
                        data,
                    })
                }
            } else {
                resolve({
                    ret:0,
                    errMsg: '获取APH服务器数据失败',
                    error
                })
            }
        })
    })
}
