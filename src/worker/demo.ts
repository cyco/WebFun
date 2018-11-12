import Worker from "./factory";
import Adder from "./adder";

export default async function() {
	if (!window.document) return;
	try {
		console.log("Runnin web worker proxy demo");
		const adder = await Worker.Spawn(Adder);
		console.log("adder created");
		await adder.setA(30);
		console.log("did set a");
		await adder.setB(12);
		console.log("did set b");
		const result = await adder.add();
		console.log("result", result);

		try {
			const brokenAdder = await Worker.Spawn(Adder);
			await brokenAdder.setA(30);
			const result = await brokenAdder.add();
			console.log("result from broken adder", result);
		} catch (e) {
			console.log("error from broken adder", e);
		}
	} catch (e) {
		console.error("Uncaught error in web worker demo");
		console.error(e);
	}
}
