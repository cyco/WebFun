/// import { GameType } from "src/engine/type";

declare module "test/helpers/game-data" {
	// export default (type: any, callback: (_: any) => void) => void;
}

declare module "test/helpers" {
	const getFixtureContent: (type: any) => void;
}
