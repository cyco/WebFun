import { InputStream } from "src/util";
import { GameType } from "src/engine";
import ParseError from "./manual/parse-error";
import {
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
} from "./manual";
import { error } from "./error";

const ENDF = "ENDF";

export default (input: InputStream, type: GameType): any => {
	const dispatch: any = {
		VERS: parseVersion,
		STUP: parseSetupImage,
		SNDS: parseSounds,
		TILE: parseTiles,
		ZONE: parseZones,
		PUZ2: parsePuzzles,
		CHAR: parseCharacters,
		CHWP: parseCharacterWeapons,
		CAUX: parseCharacterAux,
		TNAM: parseTileNames,
		ZAUX: parseZaux,
		ZAX2: parseZax2,
		ZAX3: parseZax3,
		ZAX4: parseZax4,
		HTSP: parseHotspots,
		ACTN: parseActions,
		ZNAM: parseZoneNames,
		PNAM: parsePuzzleNames,
		ANAM: parseActionNames,
		ENDF: parseEndOfFile
	};

	let data: any = {};
	let category: string;
	do {
		category = input.getCharacters(4);
		console.log("category", category);
		const parse = dispatch[category] || (() => error(`Invalid category ${category} found.`));
		parse(input, data, type);
	} while (category !== ENDF);

	return data;
};