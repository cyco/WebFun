// by @ahejlsberg
// As seen on https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
	[x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}
