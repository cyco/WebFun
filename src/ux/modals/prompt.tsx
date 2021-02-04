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
	defaultValue: options.defaultValue || "",
	options: options.options || null
});

export default async (prompt: string, options: Options = {}): Promise<string> => {
	options = MergeDefaultOptions(options);

	const window = (
		<ConfirmationWindow
			confirmText={options.confirmText}
			abortText={options.abortText}
			customContent={
				<div>
					{prompt}
					<br />
					{options.options ? (
						<Selector value={options.defaultValue} options={options.options} />
					) : (
						<Textbox value={options.defaultValue} />
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
