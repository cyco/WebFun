module.exports = {
	parser: "@typescript-eslint/parser",
	extends: [
		"plugin:@typescript-eslint/recommended",
		"prettier/@typescript-eslint",
		"plugin:prettier/recommended"
	],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module"
	},
	rules: {
		eqeqeq: "error",
		whitespace: [true, "check-module"],
		"member-ordering": [
			true,
			{
				order: [
					"public-static-field",
					"protected-static-field",
					"private-static-field",
					"public-static-method",
					"protected-static-method",
					"private-static-method",
					"public-instance-field",
					"protected-instance-field",
					"private-instance-field",
					"public-constructor",
					"protected-constructor",
					"private-constructor"
				],
				alphabetize: false
			}
		],
		"sort-imports": [
			1,
			{
				memberSyntaxSortOrder: ["none", "all", "multiple", "single"]
			}
		],
		"no-unused-vars": ["warn", { argsIgnorePattern: "^_[a-zA-Z0-9_]*$" }],
		"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_[a-zA-Z0-9_]*$" }],
		"no-new-wrappers": "off",
		"@typescript-eslint/ban-types": "off", // disable because it does not inspect imports
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-use-before-define": "off",
		"@typescript-eslint/no-explicit-any": "off",
		// temporarily disabled:
		"@typescript-eslint/explicit-member-accessibility": "off"
	}
};
