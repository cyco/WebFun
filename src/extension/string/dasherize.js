const regex = /[A-Z](?:(?=[^A-Z])|[A-Z]*(?=[A-Z][^A-Z]|$))/g;
const dasherize = function () {
	return this.replace(regex, (s, i) => (i > 0 ? "-" : "") + s.toLowerCase());
};

String.prototype.dasherize = String.prototype.dasherize || dasherize;
export default dasherize;
