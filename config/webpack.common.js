const Path = require("path");
const Paths = require("./paths");
const Dotenv = require("dotenv-webpack");
const { GitRevisionPlugin } = require("git-revision-webpack-plugin");
const gitRevisionPlugin = new GitRevisionPlugin();
const Webpack = require("webpack");

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
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{ loader: "babel-loader", options: { cacheDirectory: true } },
					{ loader: "ts-loader" }
				]
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
				type: "asset/resource"
			}
		]
	}
};
