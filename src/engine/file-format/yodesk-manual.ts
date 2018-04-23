import { InputStream } from "src/util";
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
	parseZoneAux,
	parseZoneAux2,
	parseZoneAux3,
	parseZoneAux4,
	parseZoneNames,
	parseEndOfFile
} from "./manual";
import { error } from "./error";

const ENDF = "ENDF";

export default (input: InputStream): any => {
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
		ZAUX: parseZoneAux,
		ZAX2: parseZoneAux2,
		ZAX3: parseZoneAux3,
		ZAX4: parseZoneAux4,
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
		parse(input);
	} while (category !== ENDF);

	return data;
};
