const chalk = require('chalk')
const figlet = require('figlet')
const colors = require('colors/safe');
const request = require('../lib/request')
const {
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
  try {
    let res = await initConfigOnLine()
    if (res.APH_web_origin && res.APH_proxy_origin) {
      console.log(colors.green('[APH代理服务器地址]', res.APH_proxy_origin))
      console.log(colors.green('[APH控制台页面地址]', res.APH_web_origin))
    }else{
      throw new Error('[获取到无效APH配置信息]',res)
    }
  } catch (e) {
    return console.log(colors.red('[从远程配置中心获取APH信息失败]', e.message))
  }
}