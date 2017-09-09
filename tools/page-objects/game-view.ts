import PageObject from "./page-object";

class GameView extends PageObject {
	public get selector() {
		return "wf-content.main";
	}
}

export default GameView;
