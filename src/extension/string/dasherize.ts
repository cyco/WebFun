const regex = /[A-Z](?:(?=[^A-Z])|[A-Z]*(?=[A-Z][^A-Z]|$))/g;
const dasherize = function (): string {
	return this.replace(regex, (s: string, i: number) => (i > 0 ? "-" : "") + s.toLowerCase());
};

String.prototype.dasherize = String.prototype.dasherize || dasherize;

declare global {
	interface String {
		dasherize(): string;
	}
}

export default dasherize;
