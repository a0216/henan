/**
 * ...
 * @author minliang1112@foxmail.com
 */

import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import conf, { resolve, version } from './webpack.base.config';
import prod from "./webpack.prod.config";
import dev from "./webpack.dev.config";

let entryObj = {}, htmlArr = [];
let getEntry = (dir) => {
    fs.readdirSync(dir).filter((item) => {
        return path.extname(item) == '.js';
    }).map((item) => {
        let _name = path.basename(item, path.extname(item));
        htmlArr.push(new HtmlWebpackPlugin({
            template: "../template/template.js",
            filename: (process.env.NODE_ENV == 'production' ? ('../../../prd/') : '../dist/') + _name + '.html',
            chunks: [_name],//引入当前单页库
            title: "咪咕视频",
            root: "app",
            minify: {    //压缩HTML文件
                removeComments: true,    //移除HTML中的注释
                collapseWhitespace: false    //删除空白符与换行符
            },
            common : [
                '//m.miguvideo.com/mgs/common/miguvendor/prd/vue_mgvendor.js',
                '//m.miguvideo.com/mgs/common/migugeneral/prd/general.js',
                '//m.miguvideo.com/mgs/common/migujsbridge/prd/mgv-jsbridge.js',
                '//res.wx.qq.com/open/js/jweixin-1.4.0.js',
                '//webcrystal.miguvideo.com/web/script/migusdk.js?v=0.1.20180911'
            ]
        }));
        entryObj[_name] = [path.join(dir, item)];
    });
}

getEntry(
    resolve('.././src/js/views/')
)
let config = merge(
                    conf,
                    process.env.NODE_ENV == 'production'?prod:dev, 
                    { 
                        entry : entryObj,
                        plugins : htmlArr
                    }
            )

export default config
