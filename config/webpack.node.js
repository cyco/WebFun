const NodeExternals = require("webpack-node-externals");
const BaseConfig = require("./webpack.common");

module.exports = merge(BaseConfig, {
	target: "node",
	externals: [NodeExternals()]
});
