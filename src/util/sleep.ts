import { setTimeout } from "src/std";

export default (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
