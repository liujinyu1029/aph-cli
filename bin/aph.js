#!/usr/bin/env node
const program = require('commander');

const onLogin = require('../action/login')
const onLogout = require('../action/logout')

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
  .parse(process.argv);