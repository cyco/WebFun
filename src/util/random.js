import Message from "./message";

let lastRandom = 0;

export const srand = (seed) => lastRandom = seed;
export const rand = () => {
	lastRandom = Math.imul(lastRandom, 214013) + 2531011 & 0xFFFFFFFF;
	let result = lastRandom >> 16 & 0x7fff;
	Message("rand: %x", result);
	return result;
};
export const randmod = (mod) => rand() % mod;
