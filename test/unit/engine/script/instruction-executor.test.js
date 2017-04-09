import InstructionExecutor from '/engine/script/instruction-executor';
import { default as Instruction, Opcode } from '/engine/objects/instruction';
import * as SpeakText from '/engine/script/instructions/speak-text';

describe('InstructionExecutor', () => {
	let executor, engine;
	beforeEach(() => {
		engine = {
			currentZone: {},
			hero: {},
			state: {},
			data: {}
		};

		executor = new InstructionExecutor(engine);
	});

	it('has a function to execute a single instruction', () => {
		expect(typeof executor.execute).toBe('function');
	});

	describe('opcodes', () => {
		it('Opcode.AddHealth', () => {
			engine.hero.health = 4;

			let instruction = new Instruction({});
			instruction._opcode = Opcode.AddHealth;
			instruction._arguments = [15];

			executor.execute(instruction);
			expect(engine.hero.health).toBe(19);
		});

		it('Opcode.EnableHotspot', () => {
			engine.currentZone.hotspots = [null, null, {}, null];

			let instruction = new Instruction({});
			instruction._opcode = Opcode.EnableHotspot;
			instruction._arguments = [2];

			executor.execute(instruction);
			expect(engine.currentZone.hotspots[2].enabled).toBeTrue();
		});

		it('Opcode.DisableHotspot', () => {
			engine.currentZone.hotspots = [null, null, {}, null];

			let instruction = new Instruction({});
			instruction._opcode = Opcode.DisableHotspot;
			instruction._arguments = [2];

			executor.execute(instruction);
			expect(engine.currentZone.hotspots[2].enabled).toBeFalse();
		});

		it('Opcode.EnableNPC', () => {
			engine.currentZone.npcs = [null, null, {}, null];

			let instruction = new Instruction({});
			instruction._opcode = Opcode.EnableNPC;
			instruction._arguments = [2];

			executor.execute(instruction);
			expect(engine.currentZone.npcs[2].enabled).toBeTrue();
		});

		it('Opcode.DisableAllNPC', () => {
			engine.currentZone.npcs = [{}, {}, {}];

			let instruction = new Instruction({});
			instruction._opcode = Opcode.DisableAllNPCs;
			instruction._arguments = [];

			executor.execute(instruction);
			expect(engine.currentZone.npcs[0].enabled).toBeTrue();
			expect(engine.currentZone.npcs[1].enabled).toBeTrue();
			expect(engine.currentZone.npcs[2].enabled).toBeTrue();
		});

		it('Opcode.EnableAllNPC', () => {
			engine.currentZone.npcs = [{}, {}, {}];

			let instruction = new Instruction({});
			instruction._opcode = Opcode.EnableAllNPCs;
			instruction._arguments = [];

			executor.execute(instruction);
			expect(engine.currentZone.npcs[0].enabled).toBeFalse();
			expect(engine.currentZone.npcs[1].enabled).toBeFalse();
			expect(engine.currentZone.npcs[2].enabled).toBeFalse();
		});

		it('Opcode.DisableNPC', () => {
			engine.currentZone.npcs = [null, null, {}, null];

			let instruction = new Instruction({});
			instruction._opcode = Opcode.DisableNPC;
			instruction._arguments = [2];

			executor.execute(instruction);
			expect(engine.currentZone.npcs[2].enabled).toBeFalse();
		});

		it('Opcode.SetCounter', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.SetCounter;
			instruction._arguments = [2];

			executor.execute(instruction);
			expect(engine.currentZone.counter).toBe(2);

			instruction._arguments = [100];
			executor.execute(instruction);
			expect(engine.currentZone.counter).toBe(100);
		});

		it('Opcode.AddToCounter', () => {
			engine.currentZone.counter = 5;

			let instruction = new Instruction({});
			instruction._opcode = Opcode.AddToCounter;
			instruction._arguments = [2];

			executor.execute(instruction);
			expect(engine.currentZone.counter).toBe(7);

			instruction._arguments = [-3];
			executor.execute(instruction);
			expect(engine.currentZone.counter).toBe(4);
		});

		it('Opcode.SetPadding', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.SetPadding;
			instruction._arguments = [2];

			executor.execute(instruction);
			expect(engine.currentZone.padding).toBe(2);

			instruction._arguments = [100];
			executor.execute(instruction);
			expect(engine.currentZone.padding).toBe(100);
		});

		it('Opcode.AddToPadding', () => {
			engine.currentZone.padding = 5;

			let instruction = new Instruction({});
			instruction._opcode = Opcode.AddToPadding;
			instruction._arguments = [2];

			executor.execute(instruction);
			expect(engine.currentZone.padding).toBe(7);

			instruction._arguments = [-3];
			executor.execute(instruction);
			expect(engine.currentZone.padding).toBe(4);
		});

		it('Opcode.SetRandom', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.SetRandom;
			instruction._arguments = [5];

			executor.execute(instruction);
			expect(engine.currentZone.random).toBe(5);
		});

		it('Opcode.RollDice', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.RollDice;
			instruction._arguments = [5];

			for (let i = 0; i < 10; i++) {
				executor.execute(instruction);
				expect(engine.currentZone.random).not.toBeGreaterThan(5);
			}
		});

		it('Opcode.AddItem', () => {
			engine.data.tiles = [null, 'fake-tile'];
			engine.inventory = { addItem() {} };

			spyOn(engine.inventory, 'addItem');

			let instruction = new Instruction({});
			instruction._opcode = Opcode.AddItem;
			instruction._arguments = [1];

			executor.execute(instruction);
			expect(engine.inventory.addItem).toHaveBeenCalledWith('fake-tile');
		});

		it('Opcode.RemoveItem', () => {
			engine.data.tiles = [null, 'fake-tile'];
			engine.inventory = { removeItem() {} };

			spyOn(engine.inventory, 'removeItem');

			let instruction = new Instruction({});
			instruction._opcode = Opcode.RemoveItem;
			instruction._arguments = [1];

			executor.execute(instruction);
			expect(engine.inventory.removeItem).toHaveBeenCalledWith('fake-tile');
		});

		it('Opcode.StopSound', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.StopSound;
			instruction._arguments = [];

			expect(() => executor.execute(instruction)).not.toThrow();
		});

		it('Opcode.SetTileNeedsDisplay', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.SetTileNeedsDisplay;
			instruction._arguments = [];

			expect(() => executor.execute(instruction)).not.toThrow();
		});

		it('Opcode.SetRectNeedsDisplay', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.SetRectNeedsDisplay;
			instruction._arguments = [];

			expect(() => executor.execute(instruction)).not.toThrow();
		});

		it('Opcode.Redraw', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.Redraw;
			instruction._arguments = [];

			expect(() => executor.execute(instruction)).not.toThrow();
		});

		it('Opcode.DrawTile', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.DrawTile;
			instruction._arguments = [];

			expect(() => executor.execute(instruction)).not.toThrow();
		});

		it('Opcode.PlaySound', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.PlaySound;
			instruction._arguments = [];

			expect(() => executor.execute(instruction)).not.toThrow();
		});

		it('Opcode.Wait', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.Wait;
			instruction._arguments = [];

			expect(() => executor.execute(instruction)).not.toThrow();
		});

		it('Opcode.DisableAction', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.DisableAction;
			instruction._arguments = [];

			const action = {};
			executor.action = action;

			executor.execute(instruction);
			expect(action.enabled).toBeFalse();
		});

		it('Opcode.HideHero', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.HideHero;
			instruction._arguments = [];

			executor.execute(instruction);
			expect(engine.hero.visible).toBeFalse();
		});

		it('Opcode.ShowHero', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.ShowHero;
			instruction._arguments = [];
			executor.execute(instruction);
			expect(engine.hero.visible).toBeTrue();
		});

		it('Opcode.MarkAsSolved', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.MarkAsSolved;
			instruction._arguments = [];
			executor.execute(instruction);
			expect(engine.currentZone.solved).toBeTrue();
		});

		it('Opcode.RemoveTile', () => {
			engine.currentZone.removeTile = () => {};
			spyOn(engine.currentZone, 'removeTile');

			let instruction = new Instruction({});
			instruction._opcode = Opcode.RemoveTile;
			instruction._arguments = [1, 2, 3];
			executor.execute(instruction);

			expect(engine.currentZone.removeTile).toHaveBeenCalledWith(1, 2, 3);
		});

		it('Opcode.PlaceTile', () => {
			const tile = {};
			engine.data.tiles = [null, null, tile, null];
			engine.currentZone.setTile = () => {};
			spyOn(engine.currentZone, 'setTile');

			let instruction = new Instruction({});
			instruction._opcode = Opcode.PlaceTile;
			instruction._arguments = [1, 2, 3, 2];
			executor.execute(instruction);

			expect(engine.currentZone.setTile).toHaveBeenCalledWith(tile, 1, 2, 3);
		});

		it('Opcode.SetHero', () => {
			engine.hero.location = { x: 2, y: 4 };

			let instruction = new Instruction({});
			instruction._opcode = Opcode.SetHero;
			instruction._arguments = [12, 13];
			executor.execute(instruction);

			expect(engine.hero.location.x).toEqual(12);
			expect(engine.hero.location.y).toEqual(13);
		});

		it('Opcode.MoveTile', () => {
			engine.currentZone.moveTile = () => {};
			spyOn(engine.currentZone, 'moveTile');

			let instruction = new Instruction({});
			instruction._opcode = Opcode.MoveTile;
			instruction._arguments = [0, 1, 2, 3, 4];
			executor.execute(instruction);

			expect(engine.currentZone.moveTile).toHaveBeenCalledWith(0, 1, 2, 3, 4);
		});

		it('Opcode.LoseGame', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.LoseGame;
			instruction._arguments = [0, 1, 2, 3, 4];

			expect(() => executor.execute(instruction)).toThrow("Game Lost!");
		});

		it('Opcode.WinGame', () => {
			let instruction = new Instruction({});
			instruction._opcode = Opcode.WinGame;
			instruction._arguments = [0, 1, 2, 3, 4];

			expect(() => executor.execute(instruction)).toThrow("Game Won!");
		});

		it('Opcode.SpeakHero', () => {
			const location = {};
			engine.hero.location = location;
			spyOn(SpeakText, 'default');

			let instruction = new Instruction({});
			instruction._opcode = Opcode.SpeakHero;
			instruction._additionalData = 'test text';

			executor.execute(instruction);

			expect(SpeakText.default).toHaveBeenCalledWith('test text', location, engine);
		});

		it('Opcode.SpeakNPC', () => {
			let scene = null;
			engine.sceneManager = { pushScene(s) { scene = s; } };

			let instruction = new Instruction({});
			instruction._opcode = Opcode.SpeakNPC;
			instruction._arguments = [0, 1];
			instruction._additionalData = 'test text';

			executor.execute(instruction);

			expect(scene.text).toEqual('test text');
			expect(scene.location.x).toBe(0);
			expect(scene.location.y).toBe(1);
		});

		it('Opcode.MoveHeroBy', () => {
			// is currently not implemented
			let instruction = new Instruction({});
			instruction._opcode = Opcode.MoveHeroBy;
			instruction._arguments = [];

			expect(() => executor.execute(instruction)).toThrow();
		});
		
		it('Opcode.ChangeZone', () => {
			const zone = {};
			engine.data.zones = [null, null, zone, null];
			engine.dagobah = { locationOfZone: () => true };
			engine.sceneManager = { pushScene() {} };
			spyOn(engine.sceneManager, 'pushScene');
			
			let instruction = new Instruction({});
			instruction._opcode = Opcode.ChangeZone;
			instruction._arguments = [2];

			executor.execute(instruction);
			
			expect(engine.sceneManager.pushScene).toHaveBeenCalled();
			
			engine.dagobah = { locationOfZone: () => false };
			engine.world = { locationOfZone: () => true };
			
			executor.execute(instruction);
			expect(engine.sceneManager.pushScene).toHaveBeenCalledTimes(2);
			
			engine.dagobah = { locationOfZone: () => false };
			engine.world = { locationOfZone: () => false };
			
			executor.execute(instruction);
			expect(engine.sceneManager.pushScene).toHaveBeenCalledTimes(3);
		});
	});
});
