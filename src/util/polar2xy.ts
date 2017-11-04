const polar2xy = (rho: number, theta: number): [number, number] => {
	const x = rho * Math.cos(theta);
	const y = -rho * Math.sin(theta);

	return [x, y];
};

export default polar2xy;
