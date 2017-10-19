import PageObject from "./page-object";

class HealthView extends PageObject {
	public get selector() {
		return "wf-health";
	}
}

export default HealthView;
