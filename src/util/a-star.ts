function reconstructPath<T>(parent: Map<T, T>, current: T): T[] {
	const path = [current];
	while (parent.has(current)) {
		current = parent.get(current);
		path.unshift(current);
	}

	return path;
}

function findIndex<T>(array: T[], value: T): number {
	let low = 0;
	let high = array.length;

	while (low < high) {
		const mid = (low + high) >>> 1;
		if (array[mid] < value) low = mid + 1;
		else high = mid;
	}
	return low;
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

	gScore.set(start, 0);
	fScore.set(start, h(start));

	while (open.length) {
		open.sort((o1, o2) => fScore.get(o1) - fScore.get(o2));
		const current = open.shift();

		if (current === end) return reconstructPath(parent, current);

		openSet.delete(current);

		for (const neighbor of expand(current)) {
			const tentativeGScore = gScore.get(current) + g(current, neighbor);

			if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
				parent.set(neighbor, current);
				gScore.set(neighbor, tentativeGScore);
				fScore.set(neighbor, tentativeGScore + h(neighbor));

				if (!openSet.has(neighbor)) {
					openSet.add(neighbor);
					open.splice(findIndex(open, neighbor), 0, neighbor);
				}
			}
		}
	}

	return null;
};
