const mix = require('laravel-mix');
const fs = require('fs');
const path = require('path');
require('laravel-mix-eslint');

module.exports = {
    get distFolderName() {
        return 'dist';
    },
    get distFileName() {
        return `${__dirname.split(path.sep).pop()}${mix.inProduction() ? '.min' : ''}.js`
    },
    get mixManifestFileName() {
        return 'mix-manifest.json';
    },
    get resolvedModules() {
        const resolvedModules = [
            'node_modules',
            'bower_components'
        ];
        
        if (process.env.NODE_ENV == 'development-local') {
            resolvedModules.splice(0, 0, path.resolve(__dirname, '../'));
        }

        return resolvedModules;
    },
    get webpackConfig() {
        return {
            resolve: {
                modules: this.resolvedModules
            }
        }
    },
    get removeManifest() {
        return () => {
            const manifestPath = path.resolve(__dirname, this.distFolderName, this.mixManifestFileName);
            if (fs.existsSync(manifestPath)) {
                fs.unlink(manifestPath, () => {});
            }
        }
    }
};
