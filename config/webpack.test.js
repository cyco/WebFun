const { merge } = require("webpack-merge");
const SpyOnImportsWebpackPlugin = require("./spy-on-imports-webpack-plugin");

const BaseConfig = require("./webpack.common");
const config = merge(BaseConfig, {
	devtool: "inline-source-map",
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
				test: /\.(x|f)?wftest/,
				exclude: /node_modules/,
				loader: "raw-loader"
			}
		]
	},
	plugins: [new SpyOnImportsWebpackPlugin()]
});

module.exports = config;
