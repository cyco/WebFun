import { global } from "src/std";

// HACK: Never ever let module loading interfere with the shared state of the RNG
global.lastRandom = 0;

export const srand = (seed: number): void => {
	global.lastRandom = seed;
};
export const rand = (): number => {
	global.lastRandom = (Math.imul(global.lastRandom, 214013) + 2531011) & 0xffffffff;
	return (global.lastRandom >> 16) & 0x7fff;
};
export const randmod = (mod: number): number => rand() % mod;
