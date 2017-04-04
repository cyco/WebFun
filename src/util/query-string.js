export default class QueryString {
	static Compose(data) {
		let result = "";
		
		for(const key in data) {
			if(!data.hasOwnProperty(key)) continue;
			
			if(result) result += "&";
			result += encodeURIComponent(key);
			result += '=';
			result += encodeURIComponent(data[key]);
		}
		
		return result;
	}
}