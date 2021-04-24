import { LogLevel } from "src/util";
import * as SmartPhone from "detect-mobile-browser";
import { WorldSize } from "./engine/generation";
import { Zone } from "./engine/objects";

type Settings = {
	mobile: boolean;
	pwa: boolean;
	debug: boolean;

	drawDebugStats: boolean;
	drawHotspots: boolean;
	drawHeroTile: boolean;
	drawMonsterState: boolean;
	skipDialogs: boolean;
	skipTransitions: boolean;
	skipWinScene: boolean;
	pickupItemsAutomatically: boolean;
	lookTowardsMouse: boolean;
	autosaveTestOnZoneChange: boolean;

	autostartEngine: boolean;
	revealWorld: boolean;

	playEffects: boolean;
	playMusic: boolean;

	difficulty: number;
	worldSize: number;
	tickDuration: number;
	lastPlanet: number;

	logLevel: LogLevel;

	issueTracker: string;

	debuggerActive: boolean;
};

export const defaultSettings: Settings = {
	mobile: SmartPhone(false).isAndroid() || SmartPhone(false).isIPhone(),
	pwa: new URLSearchParams(window.location.search).get("source") === "pwa",
	debug: false,

	drawDebugStats: false,
	drawHotspots: false,
	drawHeroTile: false,
	drawMonsterState: false,
	skipDialogs: false,
	skipTransitions: false,
	skipWinScene: false,
	pickupItemsAutomatically: false,
	lookTowardsMouse: true,
	autosaveTestOnZoneChange: true,

	autostartEngine: true,
	revealWorld: false,

	playEffects: false,
	playMusic: false,

	difficulty: 50,
	worldSize: WorldSize.Medium.rawValue,
	tickDuration: 100,
	lastPlanet: Zone.Planet.None.rawValue,

	logLevel: LogLevel.Debug,

	issueTracker: "https://github.com/cyco/WebFun/issues/new",

	debuggerActive: false
};

export default Settings;
