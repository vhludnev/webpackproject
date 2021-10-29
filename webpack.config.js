const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.[chunkhash].js'
    },
    devServer: {
        port: 3000
    },
    plugins: [
        new HTMLPlugin({
            template: './src/index.html',
            favicon: './src/favicon.ico'
        }),
        new CleanWebpackPlugin(),
				new Dotenv()
    ],
		devtool: 'eval-cheap-source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            }
        ],
    },
} 