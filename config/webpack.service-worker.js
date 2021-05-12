const Path = require("path");
const Paths = require("./paths");

const Dotenv = require("dotenv-webpack");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Webpack = require("webpack");
const cssnano = require("cssnano");
const postcss = require("postcss");
const { GitRevisionPlugin } = require("git-revision-webpack-plugin");
const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = {
	entry: {
		"service-worker": Path.resolve(Paths.sourceRoot, "app/service-worker/main")
	},
	mode: "production",
	output: {
		path: Paths.buildRoot,
		publicPath: "",
		filename: "[name].js"
	},
	target: "webworker",
	node: false,
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin(),
			new OptimizeCSSAssetsPlugin({ cssProcessor: postcss([cssnano]) })
		]
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx", ".jsx"],
		alias: {
			src: Paths.sourceRoot
		},
		unsafeCache: true
	},
	cache: true,
	stats: "errors-only",
	plugins: [
		gitRevisionPlugin,
		new Webpack.DefinePlugin({
			"process.env.VERSION": JSON.stringify(gitRevisionPlugin.version()),
			"process.env.COMMITHASH": JSON.stringify(gitRevisionPlugin.commithash()),
			"process.env.BRANCH": JSON.stringify(gitRevisionPlugin.branch())
		}),
		new Dotenv({ systemvars: true, silent: true, defaults: true })
	],
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: [{ loader: "babel-loader", options: { cacheDirectory: true } }]
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{ loader: "babel-loader", options: { cacheDirectory: true } },
					{ loader: "ts-loader" }
				]
			}
		]
	}
};
