const {APH_config_url} = require('../config')
const aphStore = require('./store')

 // aph代理服务地址
const APH_proxy_origin = aphStore.getAphProxy_ApiHead()
 
module.exports = {
    aphConfig: APH_config_url,
    // aph代理服务地址
    APH_proxy_origin,
    // aph控制台地址
    getLoginUrl: () => aphStore.getAphWeb_ApiHead() + '/_house_api/login',
    getUserInfoUrl: () => aphStore.getAphWeb_ApiHead() + '/_house_api/getUserInfo'
}