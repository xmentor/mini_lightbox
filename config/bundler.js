const path = require('path');
const env = process.env.NODE_ENV;
const isDev = env === 'development';

module.exports = {
    mode: env,
    context: path.resolve(__dirname, './'),
    entry: {
        lightbox: '../src/js/index.js'
    },
    output: {
        path: path.resolve(__dirname, './../dist/js'),
        filename: '[name].min.js',
        library: 'lightbox',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
            loader: 'babel-loader',
            options: {
                presets: ['es2015', 'stage-2'],
                plugins: ['babel-plugin-add-module-exports']
            }
        }]
    },
    optimization: {
        minimize: isDev ? false : true
    },
    watch: false,
    devtool: isDev ? 'eval' : 'source-map',
};