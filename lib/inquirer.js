const inquirer   = require('inquirer');
const files      = require('./files');

module.exports = {
  askLoginInfo: () => {
    const questions = [
      {
        name: 'userName',
        type: 'input',
        message: '请输入你的APH用户名:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return '用户名不可以为空！';
          }
        }
      },
      {
        name: 'passWord',
        type: 'input',
        message: '请输入密码:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return '密码不可以为空！';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  },
  askHostList: ({hostList = [], currentHost}) => {
      const questions = [
        {
          type: 'list',
          name: 'hostList',
          message: '选择域名:',
          choices: hostList,
          default: currentHost
        }
      ];
      return inquirer.prompt(questions);
    },
}
