import { global } from "./index";

const AC = (global.AudioContext || global.webkitAudioContext) as typeof AudioContext;
export { AC as AudioContext };
