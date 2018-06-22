const mix = require('laravel-mix');
const utils = require('./webpack.utils');

mix.setPublicPath(utils.distFolderName)
    .webpackConfig(utils.webpackConfig)
    .eslint()
    .js('index.js', utils.distFileName)
    .then(utils.removeManifest);
