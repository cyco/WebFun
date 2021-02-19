import SectorCounterIsGreaterThan from "src/engine/script/conditions/sector-counter-is-greater-than";

describeCondition("SectorCounterIsGreaterThan", (check, engine) => {
	it("checks if the current zone's sectorCounter value is greater than the given value", async () => {
		const condition: any = { opcode: SectorCounterIsGreaterThan.Opcode, arguments: [5] };

		engine.currentZone.sectorCounter = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.sectorCounter = 10;
		expect(await check(condition)).toBeTrue();
	});
});
