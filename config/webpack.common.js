const Path = require("path");
const Paths = require("./paths");

module.exports = {
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
		alias: {
			src: Paths.sourceRoot,
			std: Path.resolve(Paths.sourceRoot, "std"),
			libs: Path.resolve(Paths.sourceRoot, "libs"),
			test: Path.resolve(Paths.projectRoot, "test"),
			fs: Path.resolve(Paths.sourceRoot, "util/empty.ts")
		},
		unsafeCache: true
	},
	mode: "development",
	cache: true,
	stats: "errors-only",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [{ loader: "babel-loader", options: { cacheDirectory: true } }, { loader: "ts-loader" }]
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "fonts/"
						}
					}
				]
			}
		]
	}
};
