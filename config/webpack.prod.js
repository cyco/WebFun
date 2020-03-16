const Path = require("path");
const Paths = require("./paths");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
	entry: {
		webfun: Path.resolve(Paths.sourceRoot, "app/main")
	},
	mode: "production",
	output: {
		filename: "[name].js",
		path: Paths.buildRoot
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})]
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
		new BundleAnalyzerPlugin({ analyzerMode: "static" }),
		new CleanWebpackPlugin({ root: Paths.buildRoot }),
		new HtmlWebpackPlugin({
			template: Path.resolve(Paths.sourceRoot, "./app/index.html"),
			title: "WebFun",
			meta: {
				viewport: "width=device-width, user-scalable=no, viewport-fit=cover",
				"msapplication-TileColor": "#da532c",
				"theme-color": "#da532c",
				"apple-mobile-web-app-capable": "yes"
			}
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new Dotenv({ systemvars: true, silent: true })
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						options: {
							cacheDirectory: Path.resolve(Paths.configRoot, ".babel")
						}
					},
					{
						loader: "ts-loader",
						options: {
							configFile: Path.resolve(Paths.projectRoot, "tsconfig.json")
						}
					}
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
				test: /\.(xml|ico|png|svg|jpg|gif|ttf|eot|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: ["file-loader"]
			}
		]
	}
};
