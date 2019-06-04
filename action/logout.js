const colors = require('colors/safe');
const {aphStore} = require('../aph')

module.exports = () => {
  console.log(colors.yellow('--------------- 正在退出当前账号 ---------------'))
  if (!aphStore.getAphKey() && !aphStore.getLoginInfo()) {
    console.log(colors.red('[退出失败]', '当前并没有账号登录'))
    return
  }else{
    aphStore.deleteLoginInfo()
    aphStore.deleteAphKey()
    console.log(colors.green('[退出成功]', '请重新登录'))
  }
}