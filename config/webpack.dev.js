const FS = require("fs");
const Path = require("path");
const Paths = require("./paths");
const { merge } = require("webpack-merge");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const Webpack = require("webpack");

const BaseConfig = require("./webpack.common");

module.exports = merge(BaseConfig, {
	entry: {
		"webfun": Path.resolve(Paths.sourceRoot, "app/webfun/main"),
		"service-worker": Path.resolve(Paths.sourceRoot, "app/service-worker/main")
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
		contentBase: [
			Paths.projectRoot,
			Paths.assetsRoot,
			Path.resolve(Paths.sourceRoot, "app/webfun"),
			Path.resolve(Paths.sourceRoot, "app/webfun/windows/help-viewer"),
			Path.resolve(Paths.assetsRoot, "favicons"),
			Path.resolve(Paths.sourceRoot)
		],
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
			template: Path.resolve(Paths.sourceRoot, "./app/webfun/index.html"),
			title: "WebFun Development",
			meta: {
				"viewport": "width=device-width, user-scalable=no, viewport-fit=cover",
				"msapplication-TileColor": "#da532c",
				"theme-color": "#da532c",
				"apple-mobile-web-app-capable": "yes"
			}
		}),
		new Dotenv({ silent: true }),
		new Webpack.DefinePlugin({
			"process.env.SWURL": JSON.stringify("/service-worker.js")
		})
	],
	module: {
		rules: [
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader" },
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
