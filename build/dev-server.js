// 引入依赖模块
var express = require('express');
var webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware')
var config = require('../config');
var webpackConfig = require('./webpack.dev.conf')

// 创建一个express实例
var app = express();


// 调用webpack并把配置传递过去
var compiler = webpack(webpackConfig);

// 使用 webpack-dev-middleware 中间件，文件改变，自动打包
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
})

// 使用 webpack-hot-middleware 中间件，实现热加载，自动打包后自动刷新
var hotMiddleware = require('webpack-hot-middleware')(compiler);

// 为了修改html文件也能实现热加载，使用webpack插件来监听html源文件改变事件
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        // 发布事件
        hotMiddleware.publish({ action: 'reload' });
        cb();
    })
});

// 注册中间件
app.use(devMiddleware);
app.use(hotMiddleware);


const proxyPath = 'http://localhost:8086'
const proxyOption = {
  target: proxyPath,
  changeOrigin: true,
  pathRewrite: {'^/api' : '/pbsacr/term'}
}
app.use('/api', proxyMiddleware(proxyOption))

const uploadProxyOption = {
  target: proxyPath,
  changeOrigin: true
}
app.use('/pbsacr', proxyMiddleware(uploadProxyOption))

// 监听 8888 端口，开启服务器
app.listen(8888, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:8888');
})
