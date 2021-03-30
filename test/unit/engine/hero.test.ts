import Hero, { MaxHealth } from "src/engine/hero";
import Settings from "src/settings";

describe("WebFun.Engine.Hero", () => {
	let subject: Hero;
	const settings: Settings = {} as any;
	beforeAll(() => (settings.difficulty = 50));
	beforeEach(() => (subject = new Hero()));

	it("converts health correctly", () => {
		expect(Hero.ConvertDamageToHealth(100, 3)).toEqual(0);
		expect(Hero.ConvertDamageToHealth(1, 1)).toEqual(Hero.MaxHealth);
		expect(Hero.ConvertHealthToDamage(Hero.MaxHealth)).toEqual([1, 1]);
		expect(Hero.ConvertHealthToDamage(0)).toEqual([100, 3]);

		for (let i = Hero.MaxHealth - 2; i >= 2; i--) {
			const [damage, lives] = Hero.ConvertHealthToDamage(i);
			const health = Hero.ConvertDamageToHealth(damage, lives);

			expect(health).toEqual(i, `Health ${i} is converted correctly.`);
		}
	});

	it("updates damage and lives correctly", () => {
		subject.changeHealth(-1, settings);
		expect(subject.damage).toBe(2);
		expect(subject.lives).toBe(1);
		expect(subject.health).toBe(MaxHealth - 2);
		subject.changeHealth(-1, settings);
		expect(subject.damage).toBe(3);
		expect(subject.lives).toBe(1);
		expect(subject.health).toBe(MaxHealth - 3);
		subject.changeHealth(-100, settings);
		expect(subject.damage).toBe(53);
		expect(subject.lives).toBe(1);
		expect(subject.health).toBe(247);
		subject.changeHealth(-100, settings);
		expect(subject.damage).toBe(3);
		expect(subject.lives).toBe(2);
		expect(subject.health).toBe(197);
		subject.changeHealth(-25, settings);
		expect(subject.damage).toBe(16);
		expect(subject.lives).toBe(2);
		expect(subject.health).toBe(184);
		subject.changeHealth(-25, settings);
		expect(subject.damage).toBe(29);
		expect(subject.lives).toBe(2);
		expect(subject.health).toBe(171);
		subject.changeHealth(-25, settings);
		expect(subject.damage).toBe(42);
		expect(subject.lives).toBe(2);
		expect(subject.health).toBe(158);
		subject.changeHealth(-160, settings);
		expect(subject.damage).toBe(22);
		expect(subject.lives).toBe(3);
		expect(subject.health).toBe(78);
		subject.changeHealth(-160, settings);
		expect(subject.damage).toBe(100);
		expect(subject.lives).toBe(3);
		expect(subject.health).toBe(0);

		subject = new Hero();
		subject.changeHealth(-99, settings);
		expect(subject.damage).toBe(51);
		expect(subject.lives).toBe(1);
		expect(subject.health).toBe(249);

		subject = new Hero();
		subject.changeHealth(-100, settings);
		expect(subject.damage).toBe(51);
		expect(subject.lives).toBe(1);
		expect(subject.health).toBe(249);

		subject = new Hero();
		subject.changeHealth(-199, settings);
		expect(subject.damage).toBe(33);
		expect(subject.lives).toBe(2);
		expect(subject.health).toBe(167);

		subject = new Hero();
		subject.changeHealth(-200, settings);
		expect(subject.damage).toBe(33);
		expect(subject.lives).toBe(2);
		expect(subject.health).toBe(167);

		subject = new Hero();
		subject.changeHealth(-205, settings);
		expect(subject.damage).toBe(34);
		expect(subject.lives).toBe(2);
		expect(subject.health).toBe(166);

		subject = new Hero();
		subject.changeHealth(-299, settings);
		expect(subject.damage).toBe(50);
		expect(subject.lives).toBe(2);
		expect(subject.health).toBe(150);

		subject = new Hero();
		subject.changeHealth(-300, settings);
		expect(subject.damage).toBe(50);
		expect(subject.lives).toBe(2);
		expect(subject.health).toBe(150);

		subject = new Hero();
		subject.changeHealth(-301, settings);
		expect(subject.damage).toBe(50);
		expect(subject.lives).toBe(2);
		expect(subject.health).toBe(150);

		subject = new Hero();
		subject.changeHealth(-399, settings);
		expect(subject.damage).toBe(66);
		expect(subject.lives).toBe(3);
		expect(subject.health).toBe(34);

		subject = new Hero();
		subject.changeHealth(-600, settings);
		expect(subject.damage).toBe(100);
		expect(subject.lives).toBe(3);
		expect(subject.health).toBe(0);

		subject = new Hero();
		subject.health = 0;
		subject.changeHealth(-99, settings);
		expect(subject.damage).toBe(100);

		subject = new Hero();
		subject.health = 0;
		subject.changeHealth(-199, settings);
		expect(subject.damage).toBe(100);

		subject = new Hero();
		subject.health = 0;
		subject.changeHealth(-299, settings);
		expect(subject.health).toBe(0);

		subject = new Hero();
		subject.health = 0;
		subject.changeHealth(-399, settings);
		expect(subject.health).toBe(0);
	});
});
