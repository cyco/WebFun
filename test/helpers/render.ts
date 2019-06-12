import Component from "src/ui/component";

export default (text: string | Component, attributes = {}, flags: string[] = []) => {
	const id = "WebFun Test Container";
	let container = document.getElementById(id);
	if (!container) {
		container = document.createElement("div");
		container.id = id;
		document.body.appendChild(container);
	}

	const textIsString = typeof text === "string";
	const textIsHTML = textIsString && ~(text as string).indexOf("<");

	if (textIsHTML) {
		container.innerHTML = text as string;
		return container.firstElementChild;
	}

	container.textContent = "";

	const node = document.createElement(
		textIsString ? (text as string) : ((text as unknown) as typeof Component).tagName
	);
	attributes.each((key: string, value: string) => node.setAttribute(key, value));
	flags.forEach(flag => node.setAttribute(flag, ""));
	container.appendChild(node);
	return node;
};
