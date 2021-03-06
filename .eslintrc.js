module.exports = {
	parser: "@typescript-eslint/parser",
	extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
	plugins: ["@html-eslint", "eslint-plugin-react", "only-warn"],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module"
	},
	overrides: [
		{
			files: ["*.html"],
			parser: "@html-eslint/parser",
			extends: ["plugin:@html-eslint/recommended"]
		}
	],
	rules: {
		"eqeqeq": "warn",
		"react/jsx-uses-vars": "warn",
		"prefer-const": ["warn", { destructuring: "all" }],
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_[a-zA-Z0-9_]*$" }],
		"no-new-wrappers": "off",
		"@typescript-eslint/ban-types": "off", // disable because it does not inspect imports
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-use-before-define": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-empty-interface": "off",
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/no-namespace": "off",
		"@typescript-eslint/no-inferrable-types": "off",
		"@typescript-eslint/no-this-alias": "off",
		// temporarily disabled:
		"sort-imports": "off",
		"@typescript-eslint/explicit-member-accessibility": "off",
		"prettier/prettier": "warn",
		"@typescript-eslint/no-empty-function": "off"
	}
};
