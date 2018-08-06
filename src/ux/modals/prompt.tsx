import { ConfirmationWindow, Window, Textbox } from "src/ui/components";
import WindowModalSession from "../window-modal-session";
import { dispatch } from "src/util";

export declare interface Options {
	component?: string;
	confirmText?: string;
	abortText?: string;
	defaultValue?: string;
}

type ConfirmDialogContent = string | HTMLElement | HTMLDivElement[];

export declare interface ConfirmableWindow extends Window {
	onconfirm: () => void;
	onabort: () => void;
	customContent: ConfirmDialogContent;
}

const MergeDefaultOptions = (options: Options): Options => ({
	component: options.component || ConfirmationWindow.tagName,
	confirmText: options.confirmText || "OK",
	abortText: options.abortText || "No",
	defaultValue: options.defaultValue || ":"
});

export default async (prompt: string, o: Options = {}): Promise<string> => {
	const options = MergeDefaultOptions(o);

	const window = document.createElement(options.component) as ConfirmableWindow;
	window.setAttribute("confirm-text", options.confirmText);
	window.setAttribute("abort-text", options.abortText);
	window.customContent = (
		<div>
			{prompt}
			<br />
			<Textbox value={o.defaultValue} />
		</div>
	);
	const inputField = window.customContent.querySelector(Textbox.tagName) as Textbox;

	const session = new WindowModalSession(window);
	window.onconfirm = () => session.end(1);
	window.onabort = () => session.end(0);

	dispatch(() => (inputField.focus(), inputField.select()));

	return new Promise<string>(resolve => {
		session.onend = code =>
			setTimeout(() => {
				if (code === 0) {
					resolve(null);
				}
				resolve(inputField.value);
			});
		session.run();
	});
};
