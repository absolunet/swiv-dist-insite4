const mix = require('laravel-mix');
const fs = require('fs');
const path = require('path');
require('laravel-mix-eslint');

const distFolderName = 'dist';
const distFileName = `${__dirname.split(path.sep).pop()}${mix.inProduction() ? '.min' : ''}.js`;

mix.setPublicPath(distFolderName)
    .webpackConfig({
        resolve: {
            modules: [
                'node_modules',
                'bower_components'
            ]
        }
    })
    .eslint()
    .js('index.js', distFileName)
    .then(() => {
        const manifestPath = path.resolve(__dirname, distFolderName, 'mix-manifest.json');
        if (fs.existsSync(manifestPath)) {
            fs.unlink(manifestPath, () => {});
        }
    });
