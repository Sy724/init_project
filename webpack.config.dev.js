const { merge } = require('webpack-merge');

const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
    mode: 'development',
    devServer: {
        port: '8000',
        hot: true,
        compress: true, // 是否启用 gzip
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|jsx)?$/,
                loader: 'source-map-loader',
                exclude: /node_modules/,
            }
        ]
    }
})
