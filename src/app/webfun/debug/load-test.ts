import { GameController } from "src/app/webfun/index";
import { FilePicker } from "src/ui";

export default (gameController: GameController) =>
	async (file: File = null): Promise<void> => {
		if (!file) [file] = await FilePicker.Pick();
		if (!file) return;

		const contents = await file.readAsText();
		const Parser = (await import("./automation/test")).Parser;
		const testCases = Parser.Parse(file.name, contents);
		if (!testCases.length) return;
		if (!gameController.assets) await gameController.loadGameData();

		const TestCreatorWindow = (await import("./components")).TestCreatorWindow;
		testCases.forEach(testCase => {
			const simulator = document.createElement(TestCreatorWindow.tagName) as InstanceType<
				typeof TestCreatorWindow
			>;
			simulator.gameController = gameController;
			simulator.state = localStorage.prefixedWith("simulator");
			simulator.testCase = testCase;
			gameController.window.manager.showWindow(simulator);
		});
	};
