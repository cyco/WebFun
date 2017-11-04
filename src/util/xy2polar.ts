const xy2polar = (x: number, y: number): [number, number] => {
	const rho = Math.sqrt(x * x + y * y);
	const theta = Math.atan2(-y, x);
	return [rho, theta];
};

export default xy2polar;
