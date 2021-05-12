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
const TerserPlugin = require("terser-webpack-plugin");
const WebpackVisualizerPlugin = require("webpack-visualizer-plugin");
const Webpack = require("webpack");
const cssnano = require("cssnano");
const postcss = require("postcss");
const { GitRevisionPlugin } = require("git-revision-webpack-plugin");
const gitRevisionPlugin = new GitRevisionPlugin();
const FileListPlugin = require("./file-list-webpack-plugin");

module.exports = {
	entry: {
		webfun: Path.resolve(Paths.sourceRoot, "app/webfun/main")
	},
	mode: "production",
	output: {
		path: Paths.buildRoot,
		publicPath: "",
		filename: "assets/webfun.[name]-[git-revision-version].js",
		chunkFilename: "assets/webfun.[name]-[git-revision-version].js"
	},
	node: false,
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin(),
			new OptimizeCSSAssetsPlugin({ cssProcessor: postcss([cssnano]) })
		],
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
					test: /src[/\\]app[/\\][/\\]save-game-editor[/\\]/,
					priority: 10,
					reuseExistingChunk: true,
					enforce: true
				},
				"debug": {
					test: /src[/\\]app[/\\]webfun[/\\]debug[/\\]/,
					priority: 10,
					reuseExistingChunk: true,
					enforce: true
				},
				"editor": {
					test: /src[/\\]app[/\\]editor[/\\]/,
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
			"process.env.BRANCH": JSON.stringify(gitRevisionPlugin.branch()),
			"process.env.SWURL": JSON.stringify("/service-worker.js")
		}),
		new CleanWebpackPlugin({ root: Paths.buildRoot }),
		new HtmlWebpackPlugin({
			template: Path.resolve(Paths.sourceRoot, "./app/webfun/index.html"),
			minify: {
				collapseWhitespace: true,
				minifyCSS: true,
				minifyJS: true,
				removeComments: true
			}
		}),
		new CssUrlRelativePlugin(),
		new MiniCssExtractPlugin({
			filename: "assets/[name]-[git-revision-version].css",
			chunkFilename: "assets/webfun.[name]-[git-revision-version].css"
		}),
		new Dotenv({ systemvars: true, silent: true, defaults: true }),
		new CopyPlugin({
			patterns: [
				{
					from: "assets/*.wasm",
					to: "assets/[name][ext]"
				},
				{
					from: "src/manifest.json",
					to: "[name][ext]"
				},
				{
					from: "assets/icon/**",
					to: "assets/icon/[name][ext]"
				},
				{
					from: "assets/icon/favicon.ico",
					to: "[name][ext]"
				}
			]
		}),
		new FileListPlugin({
			output: "assets/install.json",
			filter: file => file.match(/\.(js|css|woff|woff2|ttf|otf|wasm|svg)$/),
			static: ["/", "/index.html", "/?source=pwa"]
		}),
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
				use: [
					{ loader: "babel-loader", options: { cacheDirectory: true } },
					{ loader: "ts-loader" }
				]
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
				exclude: /cursor/,
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
