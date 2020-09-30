const Path = require("path");
const Paths = require("./paths");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CopyPlugin = require("copy-webpack-plugin");
const CssUrlRelativePlugin = require("css-url-relative-plugin");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const PWAManifestPlugin = require("webpack-pwa-manifest");
const ServiceWorkerInjectFileList = require("./sw-file-list");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackVisualizerPlugin = require("webpack-visualizer-plugin");
const cssnano = require("cssnano");
const postcss = require("postcss");

module.exports = {
	entry: {
		"webfun": Path.resolve(Paths.sourceRoot, "app/main"),
		"webfun.sw": Path.resolve(Paths.sourceRoot, "app/service-worker")
	},
	mode: "production",
	output: {
		path: Paths.buildRoot,
		filename: "assets/[name].js",
		chunkFilename: "assets/webfun.[name].js"
	},
	node: false,
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({ cssProcessor: postcss([cssnano]) })],
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				"vendor": {
					test: /[/\\]node_modules[/\\]/,
					priority: 10,
					reuseExistingChunk: true,
					enforce: true
				},
				"save-game-editor": {
					test: /src[/\\]save-game-editor[/\\]/,
					priority: 10,
					reuseExistingChunk: true,
					enforce: true
				},
				"debug": {
					test: /src[/\\]debug[/\\]/,
					priority: 10,
					reuseExistingChunk: true,
					enforce: true
				},
				"editor": {
					test: /src[/\\]editor[/\\]/,
					priority: 10,
					reuseExistingChunk: true,
					enforce: true
				}
			},
			name(module, chunks, cacheGroupKey) {
				return `${cacheGroupKey}`;
			}
		}
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx", ".jsx"],
		alias: {
			"src": Paths.sourceRoot
		},
		unsafeCache: true
	},
	cache: true,
	stats: "errors-only",
	plugins: [
		new CleanWebpackPlugin({ root: Paths.buildRoot }),
		new PWAManifestPlugin({
			name: "WebFun",
			short_name: "WebFun",
			description: "My awesome Progressive Web App!",
			background_color: "#000",
			crossorigin: null,
			ios: true,
			includeDirectory: true,
			filename: "assets/webfun.webmanifest",
			start_url: "/?source=pwa",
			display: "fullscreen",
			scope: "/"
		}),
		new HtmlWebpackPlugin({
			template: Path.resolve(Paths.sourceRoot, "./app/index.html"),
			title: "WebFun",
			meta: {
				"viewport": "width=device-width, user-scalable=no, viewport-fit=cover",
				"msapplication-TileColor": "#da532c",
				"theme-color": "#da532c",
				"apple-mobile-web-app-capable": "yes"
			}
		}),
		new CssUrlRelativePlugin(),
		new MiniCssExtractPlugin({
			filename: "assets/[name].css",
			chunkFilename: "assets/webfun.[name].css"
		}),
		new Dotenv({ systemvars: true, silent: true, defaults: true }),
		new CopyPlugin({
			patterns: [
				{
					from: "assets/*.wasm",
					to: "assets",
					flatten: true
				},
				{
					from: "assets/icon/**",
					to: "assets/icon",
					flatten: true
				},
				{
					from: "assets/game-data/*.{data,pal,hlp}",
					to: "data",
					noErrorOnMissing: true,
					flatten: true
				},
				{
					from: "sfx-*/**/*",
					to: "data",
					noErrorOnMissing: true,
					toType: "dir",
					context: "assets/game-data"
				}
			]
		}),
		ServiceWorkerInjectFileList({ file: Path.resolve(Paths.buildRoot, "assets/webfun.sw.js") }),

		...(function (args) {
			if (!args.includes("--stats")) return [];

			return [
				new BundleAnalyzerPlugin({ analyzerMode: "static" }),
				new WebpackVisualizerPlugin({ filename: "./statistics.html" })
			];
		})(Array.from(process.argv))
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
				use: [{ loader: "babel-loader", options: { cacheDirectory: true } }, { loader: "ts-loader" }]
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					{ loader: MiniCssExtractPlugin.loader },
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
			},
			{
				test: /\.svg$/,
				include: Paths.assetsRoot,
				loader: "url-loader"
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /cursors/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "assets/font/"
						}
					}
				]
			}
		]
	}
};
