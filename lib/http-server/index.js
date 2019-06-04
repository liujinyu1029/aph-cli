var fs = require('fs'),
  path = require('path'),
  union = require('union'),
  ecstatic = require('ecstatic'),
  colors = require('colors'),
  logger = require('./util/logger'),
  findSimilarFile = require('./lib/findSimilarFile');
const request = require('../request')
const _url = require('url')
const { aphApi } = require('../../aph')

exports.HttpServer = exports.HTTPServer = HttpServer;

exports.createServer = function (options) {
  return new HttpServer(options);
}

function HttpServer(options) {
  options = options || {};
  this.root = options['root']
  this.headers = options.headers || {}
  this.contentType = options.contentType || 'application/octet-stream'
  // 允许跨域
  this.headers['Access-Control-Allow-Origin'] = '*';
  this.headers['Access-Control-Allow-Credentials'] = true;
  this.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Range';

  var before = options.before ? options.before.slice() : []

  //记录访问日志
  before.push(function (req, res, next) {
    var err
    try {
      logger.http(req, res);
    } catch(ex) {
      ex.status = 503
      err = ex
    }
    next(err)
  })


  // favicon 图标处理.
  before.push(function (req, res) {
    if (req.url === '/favicon.ico') {
      var icoPath = path.resolve( __dirname, './assets/images/favicon.ico' )
      res.setHeader('Content-Type', 'image/x-icon');
      res.write(fs.readFileSync(icoPath, "binary"), "binary");
      return res.end()
    }
    res.emit('next');
  });

  //处理静态资源.
  before.push(ecstatic({
    root: this.root,
    cache: 1,
    showDir: true,
    autoIndex: true,
    gzip: false,
    contentType: this.contentType,
    handleError: typeof options.proxy !== 'string'
  }));


  //处理一部分特殊扩展名，以指定的内容类型响应。
  // before.push(function (req, res) {
  //   let fileExt = util.getFileExtension(req.url)
  //   if(contentTypesMap[fileExt]){
  //     console.log(contentTypesMap[fileExt])
  //     res.setHeader('Content-Type', contentTypesMap[fileExt]);
  //   }
  //   res.emit('next');
  // })

  const handPostBody = req => new Promise((resolve,reject)=>{
    let data = ''
    req.on('data', function (chunk) {
      data += chunk
    })
    req.on('end', function () {
      //（1）.对url进行解码（url会对中文进行编码）
      // data = decodeURI(data);
      try{
        let resObj = JSON.parse(data)
        resolve(resObj)
      }catch(e){
        resolve({})
      }
    })
    req.on('error',function(err){
      reject(error)
    })
  })

  //创建内部的 union server
  var unionOptions = {
    before: before,
    headers: this.headers,
    onError: function (err, req, res) {
      // *** 所有post请求 都转到APH代理 
      if (req.method == 'POST') {
        handPostBody(req.request).then(body=>{
          request({
            url: _url.resolve(aphApi.APH_proxy_origin, req.url),
            cookie: req.headers.cookie,
            body
          }).then(data => {
            //重置响应状态码
            res.writeHead(200, {
              "Content-Type": "text/plain;charset=utf-8"
            })
            res.write(typeof data == 'object' && JSON.stringify(data) || data);
            return res.end()
          }).catch(error => {
            logger.http(req, res, {
              ...err,
              ...error
            })
          })
        }).catch(error => {
          logger.http(req, res, {
            ...err,
            ...error
          })
        })
      }
      // *** 出现错误的get请求 资源为空时
      else if (err.status == 404) {
        var cwd = process.cwd()
        var filePath = cwd + req.url;
        var similarFile = findSimilarFile(filePath)
        // 寻找类似文件
        if(similarFile){
          res.writeHead(200, {})  //重置响应状态码
          let fileContent = fs.readFileSync(similarFile['pathName'], 'utf-8');
          res.write(fileContent, "utf-8");
          err['transfer-url'] = similarFile['pathName'].replace(cwd, '')
          logger.http(req, res, err)
          return res.end()
        } else {
          // 找不到文件 也找不到类似的
          logger.http(req, res, err)
          return require('./lib/page/index.js')(404, req, res, err);          
        }
      } 
      // 其他 非404的get 请求错误
      else {
        logger.http(req, res, err)
        return require('./lib/page/index.js')(503, req, res, err);
      }
      
    }
  }
  if (options.ssl) {
    unionOptions.https = {
      cert: path.resolve(__dirname, './assets/pem/cert.pem'),
      key: path.resolve(__dirname, './assets/pem/key.pem')
    }
  }
  this.server = union.createServer(unionOptions)
}

HttpServer.prototype.listen = function () {
  this.server.listen.apply(this.server, arguments)
}

HttpServer.prototype.close = function () {
  return this.server.close()
}
