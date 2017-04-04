const dispatch = (fn, t = 0) => window.setTimeout(fn, t);
export default dispatch;
window.dispatch = dispatch;