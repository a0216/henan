/**
 * ...
 * @author minliang1112@foxmail.com
 */

import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import base, { resolve } from './webpack.base.config';

let config = {
    devtool: "source-map",
    mode : "development",
    output: {
        path: resolve('../dist'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: './'
    },
}

export {
    config as default
}
