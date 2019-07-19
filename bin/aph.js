#!/usr/bin/env node
const program = require('commander');

const onLogin = require('../action/login')
const onLogout = require('../action/logout')
const onShow = require('../action/show')
const onCope = require('../action/cope')

const pk = require('../package.json')

program
  .version(pk.version)
  .description('APH命令行工具')

program
  .usage('<command> [options]')
  .command('ser', '启动一个当前目录的http(s)服务')

program
  .command('login')
  .description('登录APH，输入用户名、密码')
  .action(onLogin)

program
  .command('logout')
  .description('logout退出登录的账号')
  .action(onLogout)

program
  .command('show')
  .description('查看APH代理、控制台地址')
  .action(onShow)

program
  .command('cope [fileA] [fileB]')
  .description('从a文件复制部分内容到b文件，以<!--aph [n] begin/end-->标记')
  .action(onCope)

program
  .parse(process.argv);