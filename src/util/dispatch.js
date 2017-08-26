import { setTimeout } from "/std";

const dispatch = (fn, t = 0) => setTimeout(fn, t);
export default dispatch;
