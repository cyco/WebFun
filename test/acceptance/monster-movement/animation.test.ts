import { describeMonsterMovement } from "test/helpers";
import { Zone, Char } from "src/engine/objects";
import { rand } from "src/util";

describeMonsterMovement(Char.MovementType.Animation, (ctx, tick, vars) => {
	it("moves as expected", async () => {
		const { char, zone, InitialPosition, monster } = vars;
		const tileId = () =>
			zone.getTile(InitialPosition.x, InitialPosition.y, Zone.Layer.Object)?.id ?? -1;

		await tick(".");
		expect(monster.position).toEqual(InitialPosition);
		expect(tileId()).toBe(char.frames[0].up.id);
		await tick(".");
		expect(tileId()).toBe(char.frames[0].down.id);
		await tick(".");
		expect(tileId()).toBe(char.frames[0].extensionUp.id);
		await tick(".");
		expect(tileId()).toBe(char.frames[0].left.id);
		await tick(".");
		expect(tileId()).toBe(char.frames[0].extensionDown.id);
		await tick(".");
		expect(tileId()).toBe(char.frames[0].extensionLeft.id);
		await tick(".");
		expect(tileId()).toBe(char.frames[0].up.id);

		await tick(".");
		expect(tileId()).toBe(char.frames[0].down.id);
		await tick(".");
		expect(tileId()).toBe(char.frames[0].extensionUp.id);
		await tick(".");
		expect(tileId()).toBe(char.frames[0].left.id);
		await tick(".");
		expect(tileId()).toBe(char.frames[0].extensionDown.id);
		await tick(".");
		expect(tileId()).toBe(char.frames[0].extensionLeft.id);
		await tick(".");
		expect(tileId()).toBe(char.frames[0].up.id);

		expect(rand()).toBe(22352);
	});
});
