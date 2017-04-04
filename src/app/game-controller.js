import { LoadingViewController } from './views';
import { MainWindow, MainMenu } from './windows';
import { Engine } from '/engine';

export default class {
	constructor() {
		this._engine = new Engine();
	}

	start() {
		const window = new MainWindow();
		window.menu = new MainMenu(this);

		const loadingViewController = new LoadingViewController();
		window.mainContent.appendChild(loadingViewController.view.element);

		document.body.appendChild(window.element);
		window.center();

		loadingViewController.load(this._engine);
	}

	newStory() {}

	replayStory() {}

	load() {}

	save() {}

	isGameInProgress() {
		return false;
	}

	isDataLoaded() {
		return false;
	}
}
