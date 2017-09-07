import MainMenu from "./main-menu";
import GameView from "./game-view";
import HealthView from "./health-view";
import Inventory from "./inventory";
import WeaponView from "./weapon-view";
import AmmoView from "./ammo-view";
import LocationView from "./location-view";

class MainWindow {
	page: any;
	mainMenu: MainMenu;
	gameView: GameView;
	inventory: Inventory;
	weapponView: WeaponView;
	locationView: LocationView;
	ammoView: AmmoView;
	healthView: HealthView;

	constructor(page: any) {
		this.page = page;
	}

	setup() {

	}
}

export default MainWindow;
