class QueryString {
	static Compose(data: { [_: string]: string }): string {
		let result = "";

		for (const key of Object.keys(data)) {
			if (result) result += "&";
			result += encodeURIComponent(key);
			result += "=";
			result += encodeURIComponent(data[key]);
		}

		return result;
	}
}

export default QueryString;
