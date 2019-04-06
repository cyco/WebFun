const FS = require("fs");
const Path = require("path");
const Paths = require("./paths");
const Webpack = require("webpack");
const merge = require("webpack-merge");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");

const MAX_CYCLES = 5;
let numCyclesDetected = 0;
let skippableCycles = 4;

const BaseConfig = require("./webpack.common");

module.exports = merge(BaseConfig, {
	entry: {
		webfun: Path.resolve(Paths.sourceRoot, "app/main")
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
		contentBase: [Paths.projectRoot, Paths.assetsRoot, Path.resolve(Paths.sourceRoot, "app")],
		host: process.env.host || "127.0.0.1",
		https: FS.existsSync(Path.resolve(Paths.configRoot, "ssl.key"))
			? {
					key: Path.resolve(Paths.configRoot, "ssl.key"),
					cert: Path.resolve(Paths.configRoot, "ssl.pem")
			  }
			: false,
		noInfo: true,
		progress: true,
		quiet: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: Path.resolve(Paths.sourceRoot, "./app/index.html"),
			title: "WebFun Development"
		}),
		new CircularDependencyPlugin({
			onStart({ compilation }) {
				numCyclesDetected = 0;
				skippableCycles = 4;
			},
			onDetected({ module: webpackModuleRecord, paths, compilation }) {
				numCyclesDetected++;
				if (numCyclesDetected >= skippableCycles) process.stdout.write(paths.join(" -> ") + "\n\n\n");
				compilation.warnings.push(new Error(paths.join(" -> ")));
			},
			onEnd({ compilation }) {
				if (numCyclesDetected - skippableCycles > MAX_CYCLES) {
					compilation.errors.push(
						new Error(
							`Detected ${numCyclesDetected} cycles which exceeds configured limit of ${MAX_CYCLES}.`
						)
					);
				}
			}
		})
	],
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
						loader: "css-loader"
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
