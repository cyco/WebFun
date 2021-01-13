import { Resolvable, ReferencesTo } from "src/editor/reference";

interface ResolverInterface<T extends Resolvable> {
	resolve(thing: T, op: (a: number, b: number) => boolean): ReferencesTo<T>;
}

export default ResolverInterface;
