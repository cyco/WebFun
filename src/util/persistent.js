import { localStorage } from "std.dom";

export default (object, key, storage = localStorage) => {
	const result = {};

	Object.keys(object).forEach(publicKey => {
		const storageKey = `${key}.${publicKey}`;
		const privateKey = `_${publicKey}`;

		// load default value
		result[ privateKey ] = storage.has(storageKey) ? storage.load(storageKey) : object[ publicKey ];

		// define getter / setter that immediately writes to storage
		Object.defineProperty(result, publicKey, {
			configurable: false,
			set: (value) => {
				result[ privateKey ] = value;
				storage.store(storageKey, value);
			},
			get: () => result[ privateKey ]
		});
	});
	return result;
}
