/**
 * ...
 * @author minliang1112@foxmail.com
 *
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const webpack =  require('webpack');
const proxy = require('http-proxy-middleware');
const express = require("express");
const app = express();
const setProxy = function(app, proxyobj) {
	try {
		if (Object.keys(proxyobj).length > 0) {
			var apiProxy = proxy(proxyobj.path, {
				target: proxyobj.target,
				changeOrigin: true,
				pathRewrite: {
					['^' + proxyobj.path]: ''
				}
			});
			app.use(proxyobj.path + '/*', apiProxy);
		}
	} catch (error) {}
};
//
let _svjson = './proxy.json';
let pm = new Promise((resolve, reject) => {
		fs.exists(_svjson, exists => {
		if (exists) {
			resolve();
		} else {
			reject();
		}
	})
})
pm.then(function(){
	var sv = require(_svjson);
	try {
		if (sv.proxy instanceof Array) {
			sv.proxy.forEach(proxyobj => {
				setProxy(app, proxyobj);
			});
		} else {
			setProxy(app, sv.proxy);
		}
	} catch (error) {}
	const webpackDevMiddleware = require("webpack-dev-middleware");
	const webpackHotMiddleware = require("webpack-Hot-middleware");
	const webpackConfig = require('./build/webpack.config.js').default;
	Object.keys(webpackConfig.entry).forEach(function(name){
		webpackConfig.entry[name] = [
										'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
									].concat(webpackConfig.entry[name]);
	})
	webpackConfig.plugins = [
								new webpack.optimize.OccurrenceOrderPlugin(),
								new webpack.HotModuleReplacementPlugin(),
								new webpack.NoEmitOnErrorsPlugin()
							].concat(webpackConfig.plugins);
	const complier = webpack(webpackConfig);
	app.use(webpackDevMiddleware(complier, {
		publicPath: webpackConfig.output.publicPath,
		quiet: true //向控制台显示任何内容 
	}))
	app.use(webpackHotMiddleware(complier, {
		log: false,
		heartbeat: 2000,
	}))
	//
	const DIST_DIR = path.join(__dirname, "dist");
	app.use(express.static(DIST_DIR));
	//
	http.createServer(app).listen(8080, function() {
		console.log('本地热更新服务已经启动，PORT:8080 ...');
	})
}).catch(function(){
	console.log('proxy.json配置文件未找到，启动失败！！\r\n');
	let tiplog = [
		'请建立 proxy.json 配置文件，内容范例如下：',
		'{',
		'    "proxy" : [{',
		'        "target" : "http://display.miguvideo.com",',
		'        "path" : "/api"',
		'    }]',
		'}'
	].join('\r\n');
	console.log(tiplog);
})
