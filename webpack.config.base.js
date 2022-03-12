const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
// webpack 4 及其以下版本使用 optimize-css-assets-webpack-plugin
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash:8].bundle.js', // webpack 三种 hash
        clean: true, // webpack 5.2 版本新增，清空构建空间 旧版本可以在 plugins 中配置 clean-webpack-plugin
    },
    cache: {
        type: 'memory'
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                use: ['thread-loader', 'babel-loader'],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
            },
            {
                test: /\.(s[ac]ss|css)$/i,
                exclude: /node_modules/,
                /**
                 * loader 顺序不可乱
                 * style-loader: 将 css 插入到 style 标签中
                 * css-loader：处理 css
                 * sass-loader：处理 sass
                 */
                use: [
                    // 代替 style-loader,
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                exclude: /node_modules/,
                use: ['url-loader'],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            filename: 'index.html',
            inject: 'body',
            scriptLoading: 'blocking',
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css'
        }),
        new ModuleConcatenationPlugin(),
    ],
    optimization: {
        usedExports: true, // 识别无用代码
        minimize: true, // 删除无用代码 tree shaking
        concatenateModules: true, // 尽可能的将所有模块输出到一个module，即 scope hosting
        // 压缩 css
        minimizer: [
            new TerserWebpackPlugin({}),
            new CssMinimizerWebpackPlugin({}),
        ],
        // 代码分割
        splitChunks: {
            /**
             * initial：入口 chunk，异步文件不处理
             * async：异步chunk，只处理异步导入的chunk
             * all：全部
             */
            chunks: 'all',
            cacheGroups: {
                // 自定义第三方模块
                vender: {
                    name: 'vender',
                    priority: 1, // 优先级
                    test: /node_modules/,
                    minSize: 0, // 大小限制
                    minChunks: 1, // 最少使用次数
                },
                // 公共模块
                common: {
                    name: 'common',
                    priority: 0,
                    minSize: 0,
                    minChunks: 2,
                }
            }
        }
    }
}
