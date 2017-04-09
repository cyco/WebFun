import { dispatch } from "/util";

export default () => {
	dispatch(() => {
		document.body.classList.add("cursor-reset");
		dispatch(() => document.body.classList.remove("cursor-reset"));
	});
};
