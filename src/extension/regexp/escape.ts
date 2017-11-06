const escape = (str: string) => str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");

RegExp.escape = RegExp.escape || escape;
export default escape;
