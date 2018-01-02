import { ConfirmationWindow, Window } from "src/ui/components";
import WindowModalSession from "../window-modal-session";

export enum Result {
	Confirmed,
	Aborted,
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
	component: options.component || ConfirmationWindow.TagName,
	confirmText: options.confirmText || "Yes",
	abortText: options.abortText || "No",
});

export default async (content: ConfirmDialogContent, o: Options = {}): Promise<Result> => {
	const options = MergeDefaultOptions(o);

	const window = <ConfirmableWindow>document.createElement(options.component);
	window.setAttribute("confirm-text", options.confirmText);
	window.setAttribute("abort-text", options.abortText);
	window.customContent = content;

	const session = new WindowModalSession(window);
	window.onconfirm = () => session.end(Result.Confirmed);
	window.onabort = () => session.end(Result.Aborted);

	return new Promise<Result>((resolve) => {
		session.onend = (code) => setTimeout(() => resolve(<Result>code), 0);
		session.run();
	});
}
