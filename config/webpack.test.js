const Path = require("path");
const Paths = require("./paths");
const Webpack = require("webpack");
const merge = require("webpack-merge");

const BaseConfig = require("./webpack.common");

module.exports = merge(BaseConfig, {
	devtool: "inline-source-map",
	output: {
		filename: "[name].js",
		path: Paths.buildRoot
	},
	module: {
		rules: [
			{
				test: /\.scss/,
				exclude: /node_modules/,
				loader: "ignore-loader"
			},
			{
				test: /\.txt/,
				exclude: /node_modules/,
				loader: "raw-loader"
			}
		]
	}
});
