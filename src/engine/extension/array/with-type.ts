const withType = function <T>(searchType: T) {
	return this.filter(({type}: {type: T}) => type === searchType);
};
Array.prototype.withType = withType;

export default withType;
