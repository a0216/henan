/**
 * ...
 * @author minliang1112@foxmail.com
 */

import os from 'os';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import UglifyJsParallelPlugin from "uglifyjs-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import base, { resolve, version } from './webpack.base.config';

function define() {
    return new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
    })
}

function uglify() {
    return new UglifyJsParallelPlugin({
        uglifyOptions: {
            ecma: 8,
            mangle: true,
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        },
        sourceMap: false,
        cache: true,
        parallel: os.cpus().length * 2
    })
}

let conf = {
    devtool: false,
    mode : 'production',
    output: {
        path: resolve('../prd/' + version() + '/dist'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: version()+ '/dist/'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        uglify(),
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: { removeAll: true },
                autoprefixer: false,
                safe: true
            }
        })
    ]
}

export {
    conf as default,
    define,
    uglify
}
