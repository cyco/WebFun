module.exports = {
	semi: true,
	singleQuote: false,
	tabWidth: 4,
	useTabs: true,
	printWidth: 100,
	overrides: [
		{
			files: ["**/*.json"],
			options: {
				tabWidth: 2,
				useTabs: false
			}
		},
		{
			files: ["**/*.ts"],
			options: {
				tabWidth: 2
			}
		},
		{
			files: ["**/*.tsx"],
			options: {
				tabWidth: 2
			}
		},
		{
			files: ["**/*.jsx"],
			options: {
				tabWidth: 2
			}
		},
		{
			files: ["**/*.js"],
			options: {
				tabWidth: 2
			}
		}
	],
	trailingComma: "none",
	arrowParens: "avoid",
	quoteProps: "consistent",
	jsxBracketSameLine: true
};
