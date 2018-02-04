const Path = require("path");
const Paths = require("./paths");
const Webpack = require("webpack");
const merge = require("webpack-merge");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const BaseConfig = require("./webpack.common");

module.exports = merge(BaseConfig, {
	entry: Path.resolve(Paths.sourceRoot, "index.ts"),
	devtool: "source-map",
	output: {
		filename: "webfun.[hash].js",
		path: Paths.buildRoot
	},
	devServer: {
		publicPath: "/",
		contentBase: Paths.buildRoot,
		hot: true,
		stats: "errors-only"
	},
	cache: false,
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader"
				})
			}
		]
	},
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
		new ExtractTextPlugin("webfun.[hash].css"),
		new HtmlWebpackPlugin({ template: "./src/app/index.html" })
	]
});
