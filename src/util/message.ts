import { sprintf } from "src/libs";
import { console } from "src/std";

let messagesEnabled = false;

export const Enable = () => (messagesEnabled = true);
export const Disable = () => (messagesEnabled = false);
export const Finalize = () => {
	/**/
};

export default (...args: any[]) => {
	if (!messagesEnabled) return;

	let formatString = args[0];
	let lastArgumentPosition;

	for (let i = 1; i < args.length; i++) {
		let value = args[i];
		let currentArgumentPosition: number = formatString.indexOf("%", lastArgumentPosition);
		if (currentArgumentPosition === -1) continue;

		let formatArg = formatString[currentArgumentPosition + 1];

		if (typeof value === "undefined") value = "<undefined>";
		else if (typeof value === "boolean") value = value ? 1 : 0;
		else if (value === -1) value = "65535";
		else if (formatArg === "x") {
			value = value.toString(0x10);
		} else if (formatArg === "d") {
			value = value.toString();
		} else value = value.toString();

		if (value === "ffffffff" || value === 0xffffffff) value = "65535";
		lastArgumentPosition = currentArgumentPosition + 1;

		args[i] = value;
	}

	args[0] = args[0].replace(/%x/g, "%s");
	args[0] = args[0].replace(/%d/g, "%s");
	args[0] = args[0].replace(/\n$/g, "");

	console.log(sprintf.apply(null, args));
};
