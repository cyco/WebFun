const dispatch = (fn: Function, t: number = 0) => window.setTimeout(fn, t);
export default dispatch;
