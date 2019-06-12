const Path = require("path");
const Paths = require("./paths");
const Webpack = require("webpack");
const merge = require("webpack-merge");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const BaseConfig = require("./webpack.common");

const config = merge(BaseConfig, {
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
			},
			{
				test: /\.wftest/,
				exclude: /node_modules/,
				loader: "raw-loader"
			}
		]
	}
});

if (+process.env.ci) {
	// skip type checking entirely
	config.plugins = config.plugins.filter(plugin => !(plugin instanceof ForkTsCheckerWebpackPlugin));
}

module.exports = config;
