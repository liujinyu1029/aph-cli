/**
 * 为了防止APH系统地址变更 造成aph-cli无法使用
 * so:将aph-cli配置文件，放置在线上管理，每次调用更新
 *  */
 
module.exports = {
  APH_config_url: 'http://liujinyu.xyz/resources/config/aph-cli.json',
}