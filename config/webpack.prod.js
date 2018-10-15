const Path = require("path");
const Paths = require("./paths");
const Webpack = require("webpack");
const merge = require("webpack-merge");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const BaseConfig = require("./webpack.common");

module.exports = merge(BaseConfig, {
	entry: {
		webfun: Path.resolve(Paths.sourceRoot, "app/main")
	},
	mode: "production",
	output: {
		filename: "[name].js",
		path: Paths.buildRoot
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true // set to true if you want JS source maps
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	},
	plugins: [
		new CleanWebpackPlugin([Paths.buildRoot], { root: Paths.projectRoot }),
		new HtmlWebpackPlugin({
			template: Path.resolve(Paths.sourceRoot, "./app/index.html"),
			title: "WebFun"
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		})
	],
	module: {
		rules: [
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					{ loader: "css-loader" },
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
