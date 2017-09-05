export default class QueryString {
	static Compose(data) {
		let result = "";

		for (const key of Object.keys(data)) {
			if (result) result += "&";
			result += encodeURIComponent(key);
			result += "=";
			result += encodeURIComponent(data[ key ]);
		}

		return result;
	}
}
