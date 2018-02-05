const Path = require("path");
const Paths = require("./paths");
const Webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const BaseConfig = require("./webpack.common");

module.exports = merge(BaseConfig, {
	entry: Path.resolve(Paths.sourceRoot, "app/main.ts"),
	devtool: "inline-source-map",
	output: {
		filename: "webfun.js",
		path: Paths.buildRoot
	},
	devServer: {
		publicPath: "/",
		contentBase: [
			Paths.buildRoot,
			Paths.assetsRoot,
			Path.resolve(Paths.sourceRoot, "app")
		],
		hot: true,
		stats: "errors-only"
	},
	plugins: [new Webpack.NamedModulesPlugin(), new Webpack.HotModuleReplacementPlugin()],
	module: {
		rules: [
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "css-loader",
						options: {
							minimize: true
						}
					},
					{
						loader: "sass-loader",
						options: {
							includePaths: [Path.resolve(Paths.sourceRoot, "_style"), "./"]
						}
					}
				]
			}
		]
	}
});
