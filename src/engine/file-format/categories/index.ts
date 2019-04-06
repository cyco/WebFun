import { parseActionNames, parseActions } from "./action";
import { parseCharacterAux, parseCharacterWeapons, parseCharacters } from "./character";
import { parsePuzzleNames, parsePuzzles } from "./puzzle";
import { parseTileNames, parseTiles } from "./tile";
import { parseZaux, parseZax2, parseZax3, parseZax4, parseZoneNames, parseZones } from "./zone";

import { parseEndOfFile } from "./end-of-file";
import { parseHotspots } from "./hotspot";
import { parseSetupImage } from "./setup-image";
import { parseSounds } from "./sound";
import { parseVersion } from "./version";

export {
	parseActions,
	parseActionNames,
	parseCharacters,
	parseCharacterAux,
	parseCharacterWeapons,
	parseHotspots,
	parsePuzzles,
	parsePuzzleNames,
	parseSetupImage,
	parseSounds,
	parseTiles,
	parseTileNames,
	parseVersion,
	parseZones,
	parseZaux,
	parseZax2,
	parseZax3,
	parseZax4,
	parseZoneNames,
	parseEndOfFile
};
