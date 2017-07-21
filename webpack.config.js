const Path = require('path');
const Webpack = require('webpack');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'webfun.js',
		path: Path.resolve(__dirname, 'dist')
	},
	resolve: {
		alias: {
			'src': Path.resolve(__dirname, 'src'),
			'std': Path.resolve(__dirname, 'src/std'),
			'std.dom': Path.resolve(__dirname, 'src/std.dom'),
			'test-helpers': Path.resolve(__dirname, 'test/helpers'),
			'fs': Path.resolve(__dirname, 'test/helpers/polyfill/fs.js'),
			'path': Path.resolve(__dirname, 'test/helpers/polyfill/path.js')
		},
		unsafeCache: true
	},
	module: {
		rules: [{
				/* JavaScript / Babel */
				test: /\.js$/,
				loader: "babel-loader",
				include: [
					Path.resolve(__dirname, "src")
				],
				exclude: [
					'node_modules',
					Path.resolve(__dirname, "src/editor"),
					Path.resolve(__dirname, "src/debug")
				]
			}, {
				/* JavaScript / Babel */
				test: /\.js$/,
				loader: "babel-loader",
				include: [
					Path.resolve(__dirname, "src/editor"),
					Path.resolve(__dirname, "src/debug"),
					Path.resolve(__dirname, "test/helpers")
				]
			}, { /* Kaitai-Struct definitions */
				test: /\.ksy\.yml$/,
				loader: 'kaitai-struct-loader'
			}, {
				/* Styles */
				test: /\.scss$/,
				use: [{
					loader: "style-loader"
				}, {
					loader: "css-loader"
				}, {
					loader: "sass-loader",
					options: {
						includePaths: ["src/_style"]
					}
				}],
				exclude: [
					'node_modules'
				]
			},
			/** fonts **/
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
			{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
		]
	},
	cache: true,
	plugins: [
		// new Webpack.HotModuleReplacementPlugin(),
	],

	devtool: 'inline-source-map',
	devServer: {
		publicPath: "/",
		contentBase: "./dist",
		hot: false
	}
};
