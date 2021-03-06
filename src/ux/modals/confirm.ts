import { ConfirmationWindow, Window } from "src/ui/components";

import WindowModalSession from "../window-modal-session";
import { dispatch } from "src/util";

export enum Result {
	Aborted,
	Confirmed,
	Other
}

export declare interface Options {
	component?: string;
	confirmText?: string;
	abortText?: string;
}

type ConfirmDialogContent = string | HTMLElement | HTMLDivElement[];

export declare interface ConfirmableWindow extends Window {
	onconfirm: () => void;
	onabort: () => void;
	customContent: ConfirmDialogContent;
}

const MergeDefaultOptions = (options: Options): Options => ({
	component: options.component || ConfirmationWindow.tagName,
	confirmText: options.confirmText || "Yes",
	abortText: options.abortText || "No"
});

export default async (content: ConfirmDialogContent, options: Options = {}): Promise<Result> => {
	options = MergeDefaultOptions(options);

	const window = document.createElement(options.component) as ConfirmableWindow;
	window.setAttribute("confirm-text", options.confirmText);
	window.setAttribute("abort-text", options.abortText);
	window.customContent = content;

	const session = new WindowModalSession(window);
	window.onconfirm = () => session.end(Result.Confirmed);
	window.onabort = () => session.end(Result.Aborted);

	return new Promise<Result>(resolve => {
		session.onend = code => dispatch(() => resolve(code as Result));
		session.run();
	});
};
