let messages = [];

let messagesEnabled = false;

export const Enabled = () => messagesEnabled = true;
export const Disable = () => messagesEnabled = false;

export default (...args) => {
	if (!messagesEnabled) return;
	let arg = Array.prototype.slice.call(args);

	let formatString = arg[0];
	let lastArgumentPosition;

	for (let i = 1; i < arg.length; i++) {
		let value = arg[i];
		let currentArgumentPosition = formatString.indexOf("%", lastArgumentPosition);
		if (currentArgumentPosition === -1) continue;

		let formatArg = formatString[currentArgumentPosition + 1];
		
		if (typeof value === 'undefined')
			value = '<undefined>';
		else if (typeof value === "boolean")
			value = value ? 1 : 0;
		else if (value === -1)
			value = "65535";
		else if (formatArg === "x") {
			value = value.toString(0x10);
		} else if (formatArg === "d") {
			value = value.toString();
		} else
			value = value.toString();

		if (value === "ffffffff" || value === 0xffffffff)
			value = "65535";
		lastArgumentPosition = currentArgumentPosition + 1;

		arg[i] = value;
	}

	arg[0] = arg[0].replace(/%x/g, "%s");
	arg[0] = arg[0].replace(/%d/g, "%s");
	arg[0] = arg[0].replace(/\n$/g, "");

	messages.push(arg);
};

export const Finalize = (prefix) => {
	messages.forEach((m) => {
		typeof process !== "undefined" && process.stdout.write(prefix);
		console.log.apply(console, m);
	});
	messages.splice(0, messages.length);
};
