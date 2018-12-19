const Path = require("path");
const Paths = require("./paths");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
	resolve: {
		extensions: [".js", ".ts", ".tsx", ".jsx"],
		alias: {
			src: Paths.sourceRoot,
			std: Path.resolve(Paths.sourceRoot, "std"),
			libs: Path.resolve(Paths.sourceRoot, "libs"),
			"test-helpers": Path.resolve(Paths.projectRoot, "test/helpers"),
			"test-fixtures": Path.resolve(Paths.projectRoot, "test/fixtures"),
			test: Path.resolve(Paths.projectRoot, "test"),
			fs: Path.resolve(Paths.projectRoot, "test/helpers/polyfill/fs.js"),
			path: Path.resolve(Paths.projectRoot, "test/helpers/polyfill/path.js")
		},
		unsafeCache: true
	},
	mode: "development",
	cache: true,
	stats: "errors-only",
	plugins: [new ForkTsCheckerWebpackPlugin()],
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: {
					cacheDirectory: Path.resolve(Paths.configRoot, ".babel")
				}
			},
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
							configFile: Path.resolve(Paths.projectRoot, "tsconfig.json"),
							transpileOnly: true
						}
					}
				]
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					mimetype: "application/font-woff"
				}
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
			}
		]
	}
};
