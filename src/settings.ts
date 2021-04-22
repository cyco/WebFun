import { LogLevel } from "src/util";
import * as SmartPhone from "detect-mobile-browser";

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

	logLevel: LogLevel.Debug,

	issueTracker: "https://github.com/cyco/WebFun/issues/new",

	debuggerActive: false
};

export default Settings;
