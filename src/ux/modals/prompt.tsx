import { ConfirmationWindow, Selector, Textbox } from "src/ui/components";

import WindowModalSession from "../window-modal-session";
import { dispatch } from "src/util";

export declare interface Options {
	component?: string;
	confirmText?: string;
	abortText?: string;
	defaultValue?: string;
	options?: string[] | { label: string; value: string }[];
}

type ConfirmDialogContent = string | HTMLElement | HTMLDivElement[];

export declare interface ConfirmableWindow extends ConfirmationWindow {
	onconfirm: () => void;
	onabort: () => void;
	customContent: ConfirmDialogContent;
}

const MergeDefaultOptions = (options: Options): Options => ({
	component: options.component || ConfirmationWindow.tagName,
	confirmText: options.confirmText || "OK",
	abortText: options.abortText || "No",
	defaultValue: options.defaultValue || ""
});

export default async (prompt: string, o: Options = {}): Promise<string> => {
	const options = MergeDefaultOptions(o);

	const window = (
		<ConfirmationWindow
			confirmText={options.confirmText}
			abortText={options.abortText}
			customContent={
				<div>
					{prompt}
					<br />
					{o.options ? (
						<Selector value={o.defaultValue} options={o.options} />
					) : (
						<Textbox value={o.defaultValue} />
					)}
				</div>
			}
		/>
	) as ConfirmationWindow;

	const input = (window.customContent as HTMLElement).querySelector(
		[Textbox.tagName, Selector.tagName, "input"].join(",")
	) as HTMLInputElement;

	const session = new WindowModalSession(window);
	window.onconfirm = () => session.end(1);
	window.onabort = () => session.end(0);

	dispatch(() => {
		if ("focus" in input) input.focus();
		if ("select" in input) input.select();
	});

	return new Promise<string>(resolve => {
		session.onend = code => dispatch(() => resolve(code === 0 ? null : input.value));
		session.run();
	});
};
