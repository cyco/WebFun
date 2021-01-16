import { persistent } from "src/util";
let State = {
	highScore: 0,
	lastScore: 0,
	gamesWon: 0,
	gamesLost: 0
};
export const loadState = (): typeof State => (State = persistent(State, "settings"));
export default State;
