const fs = require('fs')
const path = require('path')
const colors = require('colors/safe');

module.exports = (orgFilPath, tarFilePath) => {
  let orgFile = fs.readFileSync(path.join(process.cwd(), orgFilPath), 'utf-8')
  // 检索有多少个标记
  let aphArrStr = orgFile.match(/(<!--\s*aph.*begin\s*-->)/g)
  if (!aphArrStr) {
    return console.log('[warning] 源文件中未获取到<!--aph begin/end-->标识')
  }
  // 根据标记数量 获取对应正则 <!-- aph begin -->
  let regList = aphArrStr.map(val => {
    let res = val.match(/aph.*(?=begin)/)
    if (!res) {
      return null
    } else {
      let val = res[0].replace('aph', '').trim()
      return {
        val,
        regExp: new RegExp(`<!--\\s*aph\\s*${val}\\s*begin\\s*-->[.\\n\\S\\s]+<!--\\s*aph\\s*${val}\\s*end\\s*-->`, 'gi')
      }
    }
  })
  // 获取目标文件内容
  let tarFile = fs.readFileSync(path.join(process.cwd(), tarFilePath), 'utf-8')
  // 遍历取值正则 开始截取
  regList.forEach((obj, i) => {
    let tarRes = (tarFile.match(obj.regExp) || [''])[0]
    let orgRes = (orgFile.match(obj.regExp) || [''])[0]
    if (tarRes && orgRes) {
      tarFile = tarFile.replace(tarRes, orgRes)
      console.log(colors.green('[替换成功]：局部标记为', `<!-- aph ${obj.val} begin -->`))
    } else {
      console.log(colors.red('[替换失败]：局部标记为', `<!-- aph ${obj.val} begin -->`))
    }
  })
  // 替换目标文件内容
  fs.writeFileSync(path.join(process.cwd(), tarFilePath) , tarFile)
}
