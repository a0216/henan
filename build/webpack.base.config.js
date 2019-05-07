/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import os from 'os';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import pkg from '../package.json';
import HappyPack from 'happypack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const manifest = './dll/manifest.json';

function version() {
    try {
        let _ver = fs.readFileSync('./version.h', 'utf-8');
        _ver = _ver.replace(/[\r\n]/g, '');
        return _ver;
    } catch (error) { }
    return '';
}

function resolve(dir) {
    return path.resolve(__dirname, dir)
}

function banner() {
    return new webpack.BannerPlugin({
        banner: ['/**',
            '\n * ...',
            '\n * @author ' + pkg.author,
            '\n * ' + new Date(),
            '\n */',
            '\n'
        ].join(''),
        raw: true,
        entryOnly: true
    })
}

function dll() {
    return new webpack.DllPlugin({
        path: resolve(manifest),
        name: '[name]',
        context: __dirname
    })
}

function createHappyPlugin(id, loaders) {
    return new HappyPack({
        id: id,
        loaders: loaders,
        threadPool: happyThreadPool
    })
}

let conf = {
    context: path.join(__dirname),
    target: 'web',
    resolve: {
        extensions: ['.js', '.less', '.css', '.json', '.jsx', '.vue', '.ts'],
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: 'happypack/loader?id=happybabel',
            exclude: /node_modules/
        }, {
            test: /\.(jpg|png|gif)$/,
            use: "url-loader?limit=8192&publicPath=../&name=assets/[name].[ext]"
        }, {
            test: /\.(css|less)$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "less-loader"]
        }, {
            test: /.vue$/,
            use: "vue-loader",
            exclude: /node_modules/
        }]
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/style-[name].css",
            allChunks: true
        }),
        createHappyPlugin('happybabel', ['cache-loader', 'babel-loader']),
        banner()
    ],
    externals:{
        "axios"      : "window.mgvue.axios",
        "fly"        : "window.mgvue.fly",
        "vue"        : "window.mgvue.vue",
        "vue-router" : "window.mgvue.vueRouter",
        "vuex"       : "window.mgvue.vuex",
        "zepto"      : "window.mgvue.zepto"
    }
}

if (fs.existsSync(manifest)) {
    conf.plugins.unshift(new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require(manifest)
    }));
}

export {
    conf as default,
    resolve,
    version,
    banner,
    dll
}
