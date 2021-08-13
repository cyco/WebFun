import { Character } from "src/engine/objects";
import { rand, Point } from "src/util";

describeMonsterMovement(Character.MovementType.Scaredy, (ctx, tick, vars) => {
	it("moves as expected", async () => {
		const { monster, InitialPosition } = vars;

		expect(monster.position).toEqual(InitialPosition);
		await tick(".");
		expect(monster.position).toEqual(new Point(4, 2));
		await tick(".....");
		expect(monster.position).toEqual(new Point(4, 1));
		await tick("↑↑↑↑...");
		expect(monster.position).toEqual(new Point(4, 1));
		await tick("→.");
		expect(monster.position).toEqual(new Point(3, 1));
		await tick(".");
		expect(monster.position).toEqual(new Point(2, 1));
		await tick(".");
		expect(monster.position).toEqual(new Point(1, 1));
		await tick("↙↓↓↓↓......←←............↖↖....↗");
		expect(monster.position).toEqual(new Point(7, 4));
		await tick("↘↙←↑↑.............................→");
		expect(monster.position).toEqual(new Point(7, 4));
		await tick("↗↑↑↗.............................↓..");
		expect(monster.position).toEqual(new Point(4, 7));
		await tick("↘↓↙↓↓→→→→→..............................");
		expect(monster.position).toEqual(new Point(2, 1));
		await tick("↖↖↖↖↖↖");
		expect(monster.position).toEqual(new Point(1, 1));
		await tick(".................");
		expect(monster.position).toEqual(new Point(1, 1));

		expect(rand()).toBe(23516);
	});
});
