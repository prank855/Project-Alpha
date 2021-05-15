/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

dotenv.config();
const { NODE_ENV, PORT } = process.env;
const isProd = process.env.NODE_ENV === 'production';

const development = NODE_ENV !== 'production';

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
	mode: development ? 'development' : 'production',
	entry: {
		app: ['./src/client/index']
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(NODE_ENV),
				PORT: JSON.stringify(PORT)
			}
		}),
		new CleanWebpackPlugin(),
		new HtmlWebPackPlugin({
			template: './src/client/index.html',
			filename: './index.html',
			favicon: './src/client/assets/favicon.ico',
			minify: true
		})
	],
	module: {
		rules: [
			{
				test: /\.m?ts$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-transform-runtime'],
						cacheDirectory: true,
						targets: 'defaults'
					}
				}
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.png']
	},
	devtool: isProd ? '' : `inline-source-map`,
	devServer: {
		contentBase: ['./dist', './src/client/assets'],
		port: 3000,
		host: '0.0.0.0',
		historyApiFallback: true,
		overlay: true,
		compress: true,
		allowedHosts: ['.joshh.moe']
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: true,
				terserOptions: {
					mangle: { keep_classnames: true },
					compress: { ecma: 2015, passes: 1, unsafe: true },
					comments: false
				}
			})
		],
		minimize: false
	}
};
