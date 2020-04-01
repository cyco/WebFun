module.exports = {
	semi: true,
	singleQuote: false,
	tabWidth: 4,
	useTabs: true,
	printWidth: 110,
	overrides: [
		{
			files: ["**/*.json"],
			options: {
				tabWidth: 2,
				useTabs: false
			}
		}
	],
	trailingComma: "none",
	arrowParens: "avoid",
	quoteProps: "consistent",
	jsxBracketSameLine: true
};
