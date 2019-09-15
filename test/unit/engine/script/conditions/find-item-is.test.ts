import { Condition } from "src/engine/objects";
import FindItemIs from "src/engine/script/conditions/find-item-is";
import Sector from "src/engine/sector";

describeCondition("FindItemIs", (check, engine) => {
	it("is true if the zone's find item matches the first argument", async () => {
		const condition = new Condition({ opcode: FindItemIs.Opcode, arguments: [10] });
		const sector = { findItem: { id: 10 } };
		spyOn(engine.currentWorld, "findSectorContainingZone").and.returnValue(sector as Sector);
		expect(await check(condition)).toBeTrue();

		sector.findItem.id = 5;
		expect(await check(condition)).toBeFalse();

		sector.findItem = null;
		expect(await check(condition)).toBeFalse();
	});
});
