import MainWindow from "./main-window";
import PageObject from "./page-object";

class LocationView extends PageObject {
	public get selector() {
		return "wf-location";
	}
}

export default LocationView;
