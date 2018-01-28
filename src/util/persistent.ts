import { localStorage } from "src/std.dom";

export default <T>(object: T, key: string, storage: Storage = localStorage): T => {
	const result: { [_: string]: string } = {};

	let iterableObject = <{ [_: string]: any }>object;
	Object.keys(iterableObject).forEach(publicKey => {
		const storageKey = `${key}.${publicKey}`;
		const privateKey = `_${publicKey}`;

		// load default value
		result[privateKey] = storage.has(storageKey) ? storage.load(storageKey) : iterableObject[publicKey];

		// define getter / setter that immediately writes to storage
		Object.defineProperty(result, publicKey, {
			configurable: false,
			set: value => {
				result[privateKey] = value;
				storage.store(storageKey, value);
			},
			get: () => result[privateKey]
		});
	});

	return <T>(<any>result);
};
