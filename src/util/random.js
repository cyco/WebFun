let lastRandom = 0;

export const srand = (seed) => lastRandom = seed;
export const rand = () => {
	lastRandom = Math.imul(lastRandom, 214013) + 2531011 & 0xFFFFFFFF;
	return lastRandom >> 16 & 0x7fff;
};
export const randmod = (mod) => rand() % mod;

window.srand = srand;
window.rand = rand;
window.randmod = randmod;
