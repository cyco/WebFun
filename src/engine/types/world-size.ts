export default {
	SMALL: 1,
	MEDIUM: 2,
	LARGE: 3,

	FromNumber(num: number): number {
		if (!Object.values(this).contains(num) || typeof num !== "number")
			throw new RangeError(`Invalid world-size ${num} specified`);

		return num;
	}
};
