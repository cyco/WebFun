const Planet = {
	NONE: 0,
	TATOOINE: 1,
	HOTH: 2,
	ENDOR: 3,
	DAGOBAH: 5,

	FromNumber(num) {
		if (!Object.values(this).contains(num) || typeof num !== "number")
			throw new RangeError(`Invalid planet ${num} specified`);

		return num;
	}
};
export default Planet;
