import { dispatch } from '/util';

export default () => {
	dispatch(() => {
		document.body.classList.add('cursorReset');
		dispatch(() => document.body.classList.remove('cursorReset'));
	});
};
