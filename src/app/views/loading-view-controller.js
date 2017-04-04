import { LoadingView } from '/app/ui';
import Loader from '/app/loader';
import { BatchLoader } from '/util';

export const Event = {
	DidLoad: 'LoadingViewController.Event.DidLoad'
};

export default class LoadingViewController {
	constructor() {
		this._view = new LoadingView();

		const loader = new Loader();
		loader.onfail = (event) => console.log('fail', event);
		loader.onload = (event) => {
			this._view.progress = 1.0;
			console.log('done'); //self.success(event);
		};
		loader.onprogress = ({detail: { progress }}) => {
			console.log('progress', progress);
			this._view.progress = progress;
		};
		loader.onloadcategory = (event) => {
			if (event.detail.categoryName !== 'STUP') {
				return;
			}

			const loader = event.detail.category.loader;
			const loadCallback = () => {
				const imageNode = event.detail.category.imageNode;
				this._view.backgroundImageSource = imageNode.src;
				loader.removeEventListener(BatchLoader.Event.Finish, loadCallback);
			};
			loader.addEventListener(BatchLoader.Event.Finish, loadCallback);
			loader.start();
		};
		this._loader = loader;
	}

	get view() {
		return this._view;
	}

	load(engine) {
		this._loader.load(engine);
	}
}
