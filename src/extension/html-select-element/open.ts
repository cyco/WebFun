import { window, document, HTMLSelectElement } from "src/std.dom";

function open() {
	setTimeout(() => {
		if (document.createEvent) {
			const event = document.createEvent("MouseEvents");
			event.initMouseEvent(
				"mousedown",
				false,
				true,
				window,
				0,
				0,
				0,
				0,
				0,
				false,
				false,
				false,
				false,
				0,
				null
			);
			this.dispatchEvent(event);
		} else if ((this as any).fireEvent) {
			(this as any).fireEvent("onmousedown");
		} else console.assert(false, "Select box can't be opened automatically");
	});
}

HTMLSelectElement.prototype.open = HTMLSelectElement.prototype.open || open;

declare global {
	interface HTMLSelectElement {
		open(): void;
	}
}

export default open;
