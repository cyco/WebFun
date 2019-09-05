const FS = require("fs");
const Path = require("path");
const Paths = require("./paths");
const Webpack = require("webpack");
const merge = require("webpack-merge");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const BaseConfig = require("./webpack.common");

module.exports = merge(BaseConfig, {
	entry: {
		webfun: Path.resolve(Paths.sourceRoot, "app/main")
	},
	devtool: "eval-source-map",
	mode: "development",
	output: {
		filename: "[name].js",
		path: Paths.buildRoot,
		globalObject: "(typeof self !== 'undefined' ? self : this)"
	},
	devServer: {
		clientLogLevel: "error",
		contentBase: [Paths.projectRoot, Paths.assetsRoot, Path.resolve(Paths.sourceRoot, "app")],
		host: process.env.host || "127.0.0.1",
		https: FS.existsSync(Path.resolve(Paths.configRoot, "ssl.key"))
			? {
					key: Path.resolve(Paths.configRoot, "ssl.key"),
					cert: Path.resolve(Paths.configRoot, "ssl.pem")
			  }
			: false,
		progress: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: Path.resolve(Paths.sourceRoot, "./app/index.html"),
			title: "WebFun Development"
		})
	],
	module: {
		rules: [
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader"
					},
					{
						loader: "sass-loader",
						options: {
							sassOptions: {
								includePaths: [Path.resolve(Paths.sourceRoot, "_style"), "./"]
							}
						}
					}
				]
			}
		]
	}
});
