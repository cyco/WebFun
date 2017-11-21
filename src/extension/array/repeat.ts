import { constantly } from "src/util";

const repeat = <T>(item: T, count: number) => Array.apply(null, Array(count)).map(constantly(item));

Array.Repeat = Array.Repeat || repeat;

declare global {
	interface ArrayConstructor {
		Repeat<T>(item: T, count: number): T[];
	}
}

export default Array.Repeat;
