import * as Conditions from "../src/engine/script/conditions";
import * as Instructions from "../src/engine/script/instructions";

function buildTable(Objects) {
	console.log("Opcode", "|", "Name", "|", "# of arguments", "|", "Description");
	console.log("----|-------|-------|------");
	for (const name in Objects) {
		if (!Objects.hasOwnProperty(name)) continue;

		const condition = Objects[name];
		if (condition.Opcode === undefined) continue;

		const opcode = "0x" + condition.Opcode.toString(0x10).padStart(3, "0");
		const alias = name;
		const argCount = condition.Arguments;
		const description = condition.Description || "";

		console.log(opcode, "|", alias, "|", argCount, "|", description);
	}
	console.log("");
}

buildTable(Conditions);
buildTable(Instructions);
