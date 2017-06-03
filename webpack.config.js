const Path = require('path');
const Webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'webfun.js',
		path: Path.resolve(__dirname, 'build')
	},
	resolve: {
		alias: {
			'std': Path.resolve(__dirname, 'src/std'),
			'std.dom': Path.resolve(__dirname, 'src/std.dom'),
			'test-helpers': Path.resolve(__dirname, 'test/helpers')
		}
	},
	module: {
		rules: [{
			/* JavaScript / Babel */
			test: /\.js?$/,
			loader: "babel-loader",
			include: [
				Path.resolve(__dirname, "src")
			]
		}, {
			/* Styles */
			test: /\.scss$/,
			use: [{
				loader: "style-loader"
			}, {
				loader: "css-loader"
			}, {
				loader: "sass-loader"
			}]
		}]
	},
	plugins: [
		new Webpack.HotModuleReplacementPlugin(),
	],

	devtool: 'inline-source-map',
	devServer: {
		publicPath: "/",
		contentBase: "./dist",
		hot: true
	}
};
