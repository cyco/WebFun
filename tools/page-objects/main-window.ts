import RootPageObject from "./root-page-object";

import MainMenu from "./main-menu";
import GameView from "./game-view";
import HealthView from "./health-view";
import Inventory from "./inventory";
import WeaponView from "./weapon-view";
import AmmoView from "./ammo-view";
import LocationView from "./location-view";

class MainWindow extends RootPageObject {
	mainMenu: MainMenu;
	gameView: GameView;
	inventory: Inventory;
	weapponView: WeaponView;
	locationView: LocationView;
	ammoView: AmmoView;
	healthView: HealthView;

	public element: any;

	public get selector() {
		return "wf-main-window";
	}

	constructor(page: any) {
		super(page);

		this.mainMenu = new MainMenu(this);
		this.gameView = new GameView(this);
		this.inventory = new Inventory(this);
		this.weapponView = new WeaponView(this);
		this.locationView = new LocationView(this);
		this.ammoView = new AmmoView(this);
		this.healthView = new HealthView(this);
	}

	async setup() {
		await this.mainMenu.setup();
		await this.gameView.setup();
		await this.inventory.setup();
		await this.weapponView.setup();
		await this.locationView.setup();
		await this.ammoView.setup();
		await this.healthView.setup();
	}
}

export default MainWindow;
