import { setTimeout } from "src/std";

export default (ms: number = undefined): Promise<void> =>
	new Promise(resolve => setTimeout(resolve, ms));
