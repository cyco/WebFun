export default {
	Floor: 0,
	Object: 1,
	Roof: 2,

	NameFromNumber(layer: number) {
		switch (layer) {
			case 0:
				return "floor";
			case 1:
				return "object";
			case 2:
				return "roof";
		}
	}
};
