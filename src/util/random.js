import { global } from "src/std";
import Message from "./message";

// HACK: Never ever let module loading interfere with the shared state of the RNG
global.lastRandom = 0;

export const srand = (seed) => global.lastRandom = seed;
export const rand = () => {
	global.lastRandom = Math.imul(global.lastRandom, 214013) + 2531011 & 0xFFFFFFFF;
	let result = global.lastRandom >> 16 & 0x7fff;
	Message("rand: %x", result);
	return result;
};
export const randmod = (mod) => rand() % mod;
