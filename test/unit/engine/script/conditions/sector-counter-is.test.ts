import { Condition } from "src/engine/objects";
import SectorCounterIs from "src/engine/script/conditions/sector-counter-is";

describeCondition("SectorCounterIs", (check, engine) => {
	it("checks if the current zone's sectorCoutner value is equal to the given value", async () => {
		const condition: Condition = { opcode: SectorCounterIs.Opcode, arguments: [5] } as any;

		engine.currentZone.sectorCounter = 5;
		expect(await check(condition)).toBeTrue();

		engine.currentZone.sectorCounter = 10;
		expect(await check(condition)).toBeFalse();
	});
});
