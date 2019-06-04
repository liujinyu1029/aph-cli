const Configstore = require('configstore')
const pk = require('../package.json')
const conf = new Configstore(pk.name)

module.exports = {
  conf,
  // -- aph控制台(web)系统api前缀 --
  getAphWeb_ApiHead: () => conf.get('AphWeb_ApiHead'),
  setAphWeb_ApiHead: (AphWeb_ApiHead) => conf.set('AphWeb_ApiHead', AphWeb_ApiHead),
  deleteAphWeb_ApiHead: () => conf.delete('AphWeb_ApiHead'),
   // -- aph反向代理(proxy)系统api前缀 --
  getAphProxy_ApiHead: () => conf.get('AphProxy_ApiHead'),
  setAphProxy_ApiHead: (AphProxy_ApiHead) => conf.set('AphProxy_ApiHead', AphProxy_ApiHead),
  deleteAphProxy_ApiHead: () => conf.delete('AphProxy_ApiHead'),
  // 登录信息：用户名、密码
  getLoginInfo: () => conf.get('loginInfo'),
  setLoginInfo: (loginForm) => conf.set('loginInfo', loginForm),
  deleteLoginInfo: () => conf.delete('loginInfo'),
  // aph-webServer token
  getToken: () => conf.get('Token'),
  setToken: (token) => conf.set('Token', token),
  deleteToken: () => conf.delete('Token'),
  // aph-proxy aph_key
  getAphKey: () => conf.get('AphKey'),
  setAphKey: (AphKey) => conf.set('AphKey', AphKey),
  deleteAphKey: () => conf.delete('AphKey'),
}

