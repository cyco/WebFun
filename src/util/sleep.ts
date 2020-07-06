import { setTimeout } from "src/std";

export default (ms: number = undefined) => new Promise(resolve => setTimeout(resolve, ms));
