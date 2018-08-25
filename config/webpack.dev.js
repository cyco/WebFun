const Path = require("path");
const Paths = require("./paths");
const Webpack = require("webpack");
const merge = require("webpack-merge");

const BaseConfig = require("./webpack.common");

module.exports = merge(BaseConfig, {
	entry: {
		webfun: Path.resolve(Paths.sourceRoot, "app/main")
	},
	devtool: "inline-source-map",
	mode: "development",
	output: {
		filename: "[name].js",
		path: Paths.buildRoot
	},
	serve: {
		content: [Paths.projectRoot, Paths.assetsRoot, Path.resolve(Paths.sourceRoot, "app")]
	},
	plugins: [],
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
