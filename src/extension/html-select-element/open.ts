import { HTMLSelectElement, document, window } from "src/std/dom";

function open(): Promise<unknown> {
	return new Promise<void>((resolve, reject) =>
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
				resolve();
			} else if ((this as any).fireEvent) {
				(this as any).fireEvent("onmousedown");
				resolve();
			} else reject("Select box can't be opened automatically");
		})
	);
}

if (HTMLSelectElement) HTMLSelectElement.prototype.open = HTMLSelectElement.prototype.open || open;

declare global {
	interface HTMLSelectElement {
		open(): Promise<void>;
	}
}

export default open;
