const chalk = require('chalk')
const figlet = require('figlet')
const colors = require('colors/safe');
const request = require('../lib/request')
const inquirer = require('../lib/inquirer')
const {
  aphStore,
  aphApi
} = require('../aph')

let initConfigOnLine = async () => {
  let res = await request({
    url: aphApi.aphConfig,
    method: 'get'
  })
  return res
}

module.exports = async () => {
  console.log(chalk.yellow(
    figlet.textSync('APH', {horizontalLayout: 'full'})
  ))
  // 热身准备，从远程获取aph-cli配置
  let APH_web_origin = aphStore.getAphWeb_ApiHead()
  let APH_proxy_origin = aphStore.getAphProxy_ApiHead()
  if (!APH_web_origin && !APH_proxy_origin) {
    try {
      let res = await initConfigOnLine()
      if (!res.APH_web_origin || !res.APH_proxy_origin){
        throw new Error('远程获取的配置文件缺少APH_web_origin、APH_proxy_origin')
      }
      aphStore.setAphWeb_ApiHead(res.APH_web_origin)
      aphStore.setAphProxy_ApiHead(res.APH_proxy_origin)
    } catch (e) {
      aphStore.deleteAphWeb_ApiHead()
      aphStore.deleteAphProxy_ApiHead()
      return console.log(colors.red('[获取APH配置信息失败]', e.message))
    }
  }
  // 开始登陆
  let loginInfo = aphStore.getLoginInfo()
  let aphKey = aphStore.getAphKey()
  // 一、已登录
  if (aphKey && loginInfo) {
    console.log(colors.green('=============== 已有账号在登录中 ==============='))
    console.log(colors.green('[用户名] '),   colors.yellow(loginInfo.userName))
    console.log(colors.green('[aph_key]'), colors.yellow(aphKey))
    console.log(colors.grey('>>PS:如想更换账号，请执行登出命令：aph logout'))
    return
  }
  console.log(colors.green('-------------------- 登录APH -------------------'))
  // 二、未登录
  // 1、获取登录信息：用户名、密码
  loginInfo = await inquirer.askLoginInfo()
  // 2、访问 aph-web 获取 token
  try{
    let resToken = await request({
      url: aphApi.getLoginUrl(),
      body: loginInfo
    })
    if (!resToken.ret){
      throw Error((resToken.error||{}).message||'未获得错误信息')
    }
    aphStore.setToken((resToken.data || {}).token)
  }catch(e){
    console.log(colors.red('[登录失败]', e.message))
    aphStore.deleteToken()
    return
  }
  // 3、访问 aph-web 获取 用户信息
  try{
    let userInfo = await request({
      url: aphApi.getUserInfoUrl()
    })
    aphStore.setAphKey((userInfo.data || {})._id)
    aphStore.setLoginInfo(loginInfo)
    console.log(colors.green('[登录成功]'), colors.green(loginInfo.userName))
  }catch(e){
    console.log(colors.red('[登录失败]', e))
    aphStore.deleteAphKey()
    return
  }
}