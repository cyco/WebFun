import SectorCounterIsLessThan from "src/engine/script/conditions/sector-counter-is-less-than";

describeCondition("SectorCounterIsLessThan", (check, engine) => {
	it("checks if the current zone's sectorCounter value is greater than the given value", async () => {
		const condition: any = { opcode: SectorCounterIsLessThan.Opcode, arguments: [5] };

		engine.currentZone.sectorCounter = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.sectorCounter = 4;
		expect(await check(condition)).toBeTrue();
	});
});
