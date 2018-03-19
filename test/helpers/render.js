export default (text, attributes = {}, flags = []) => {
	const id = "WebFun Test Container";
	let container = document.getElementById(id);
	if (!container) {
		container = document.createElement("div");
		container.id = id;
		document.body.appendChild(container);
	}

	const textIsString = typeof text === "string";
	const textIsHTML = textIsString && ~text.indexOf("<");

	if (textIsHTML) {
		container.innerHTML = text;
		return container.firstElementChild;
	}

	container.clear();

	const node = document.createElement(textIsString ? text : text.TagName);
	attributes.each((key, value) => node.setAttribute(key, value));
	flags.forEach(flag => node.setAttribute(flag, ""));
	container.appendChild(node);
	return node;
};
