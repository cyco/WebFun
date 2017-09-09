import PageObject from "./page-object";

class MainMenu extends PageObject {
	public get selector() {
		return "wf-menubar";
	}
}

export default MainMenu;
