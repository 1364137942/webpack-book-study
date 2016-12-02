/**
 * Created by 子健 on 2016-12-2.
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require("./lib/parts");

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

const common =  {
    // Entry accepts a path or an object of entries.
    // We'll be using the latter form given it's
    // convenient with more complex configurations.
    entry: {
        app: PATHS.app
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack demo'
        })
    ]
};

var config;

//探测npm是如何运行的
switch(process.env.npm_lifecycle_event) {
    case 'build':
        config = merge(
            common,
            parts.setFreeVariable(
                'process.env.NODE_ENV',
                'production'
            ),
            parts.minify(),
            parts.setupCSS(PATHS.app),
            {
                devtool: 'source-map'
            }
            );
        break;
    default:
        config = merge(
            common,
            parts.setupCSS(PATHS.app),
            {
                devtool: 'eval-source-map'
            },
            parts.devServer({
                host: process.env.HOST,
                port: process.env.PORT
            })
        )
}
module.exports = validate(config);