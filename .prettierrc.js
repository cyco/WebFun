module.exports = {
	semi: true,
	singleQuote: false,
	printWidth: 120,
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
	]
};
