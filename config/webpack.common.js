const Path = require("path");
const Paths = require("./paths");

module.exports = {
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
		alias: {
			src: Paths.sourceRoot,
			std: Path.resolve(Paths.sourceRoot, "std"),
			libs: Path.resolve(Paths.sourceRoot, "libs"),
			test: Path.resolve(Paths.projectRoot, "test")
		},
		unsafeCache: true
	},
	mode: "development",
	cache: true,
	stats: "errors-only",
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
				options: {
					cacheDirectory: Path.resolve(Paths.configRoot, ".babel")
				}
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules|(src\/(debug|editor|save-game-editor))/,
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
				test: /\.tsx?$/,
				exclude: /node_modules/,
				include: /src\/(debug|editor|save-game-editor)/,
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
