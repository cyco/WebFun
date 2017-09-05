const withType = function (searchType) {
	return this.filter(({ type }) => type === searchType);
};
Array.prototype.withType = withType;
export default withType;
