import PageObject from "./page-object";

class Inventory extends PageObject {
	public get selector() {
		return "wf-inventory";
	}
}

export default Inventory;
