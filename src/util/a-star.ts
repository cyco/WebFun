function reconstructPath<T>(parent: Map<T, T>, current: T): T[] {
	const path = [current];
	while (parent.has(current)) {
		current = parent.get(current);
		path.unshift(current);
	}

	return path;
}

export default <T>(
	start: T,
	end: T,
	expand: (node: T) => T[],
	g: (node1: T, node2: T) => number,
	h: (node: T) => number
): T[] => {
	const openSet = new Set<T>([start]);
	const open: T[] = [start];
	const parent = new Map<T, T>();
	const gScore = new Map<T, number>();
	const fScore = new Map<T, number>();

	function findIndex(array: T[], value: T): number {
		const val = (node: T): number => fScore.get(node);
		const v = val(value);

		let low = 0;
		let high = array.length;

		while (low < high) {
			const mid = (low + high) >>> 1;
			if (val(array[mid]) < v) low = mid + 1;
			else high = mid;
		}

		return low;
	}

	gScore.set(start, 0);
	fScore.set(start, h(start));

	while (open.length) {
		const current = open.shift();
		if (!openSet.has(current)) continue;

		if (current === end) return reconstructPath(parent, current);

		openSet.delete(current);

		for (const neighbor of expand(current)) {
			const tentativeGScore = gScore.get(current) + g(current, neighbor);

			if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
				parent.set(neighbor, current);
				gScore.set(neighbor, tentativeGScore);
				fScore.set(neighbor, tentativeGScore + h(neighbor));
				openSet.add(neighbor);
				open.splice(findIndex(open, neighbor), 0, neighbor);
			}
		}
	}

	return null;
};
