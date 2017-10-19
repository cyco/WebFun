import { setTimeout } from "src/std";

const dispatch = (fn: Function, t: number = 0) => setTimeout(fn, t);
export default dispatch;
