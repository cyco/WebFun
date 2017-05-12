import { loopedSwitch, array } from "/parser/functions";
import { character } from "/parser/types";

import { version } from "./version";
import { characters, characterWeapons, characterAuxiliaries } from "./character";
import { setupImage } from "./setup-image";
import { puzzles } from "./puzzle";
import { sounds } from "./sound";
import { tiles } from "./tile";
import { tileNames } from "./tile-name";
import { zones } from "./zone";
import { end } from "./end";

export default loopedSwitch(array(character, 4), {
	"VERS": version,
	"STUP": setupImage,
	"CHAR": characters,
	"CAUX": characterAuxiliaries,
	"CHWP": characterWeapons,
	"PUZ2": puzzles,
	"SNDS": sounds,
	"TILE": tiles,
	"TNAM": tileNames,
	"ZONE": zones,
	"ENDF": end
});
