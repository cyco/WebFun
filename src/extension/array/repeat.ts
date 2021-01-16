import { Array } from "src/std";

const repeat = <T>(item: T, count: number): T[] => Array(count).fill(item);

Array.Repeat = Array.Repeat || repeat;

declare global {
	interface ArrayConstructor {
		Repeat<T>(item: T, count: number): T[];
	}
}

export default repeat;
