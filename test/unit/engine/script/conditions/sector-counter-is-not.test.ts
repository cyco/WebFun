import SectorCounterIsNot from "src/engine/script/conditions/sector-counter-is-not";

describeCondition("", (check, engine) => {
	it("checks if the current zone's sectorCounter value is not equal to the given value", async () => {
		const condition: any = { opcode: SectorCounterIsNot.Opcode, arguments: [5] };

		engine.currentZone.sectorCounter = 5;
		expect(await check(condition)).toBeFalse();

		engine.currentZone.sectorCounter = 10;
		expect(await check(condition)).toBeTrue();
	});
});
