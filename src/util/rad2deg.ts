const PI = Math.PI;

const rad2deg = (rad: number): number => {
	return ((rad + PI) / (2 * PI)) * 360;
};

export default rad2deg;
