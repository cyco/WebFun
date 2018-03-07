const Path = require("path");
const Paths = require("./paths");
const Webpack = require("webpack");
const merge = require("webpack-merge");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CSSNano = require("cssnano");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const BaseConfig = require("./webpack.common");

module.exports = merge(BaseConfig, {
	mode: "production",
	entry: Path.resolve(Paths.sourceRoot, "app/main.ts"),
	devtool: "source-map",
	output: {
		filename: "webfun.js",
		path: Paths.buildRoot
	},
	cache: false,
	plugins: [
		new CleanWebpackPlugin(Paths.buildRoot, {
			root: Paths.projectRoot,
			verbose: false
		}),
		new UglifyJSPlugin({
			sourceMap: true
		}),
		new Webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify("production")
		}),
		new ExtractTextPlugin("webfun.css"),
		new OptimizeCssAssetsPlugin({
			cssProcessor: CSSNano,
			cssProcessorOptions: { discardComments: { removeAll: true } }
		}),
		new HtmlWebpackPlugin({ template: "./src/app/index.html" }),

		new CopyWebpackPlugin([
			{
				from: Path.resolve(Paths.assetsRoot, "game-data"),
				to: "game-data"
			}
		])
	],
	module: {
		rules: [
			{
				/* Styles */
				test: /\.scss$/,
				exclude: /node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
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
				})
			}
		]
	}
});
