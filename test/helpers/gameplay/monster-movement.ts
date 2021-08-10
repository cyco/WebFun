import { Char, Zone, Tile, Monster } from "src/engine/objects";
import { srand, Size, Point } from "src/util";
import { SimulatedStory } from "src/app/webfun/debug";
import { Story, AssetManager } from "src/engine";
import { GameplayContext } from "src/app/webfun/debug/automation/test";
import loadGameData from "test/helpers/game-data";
import { ReplayingInputManager } from "src/app/webfun/debug/automation";

declare let withTimeout: (t: number, block: () => void) => () => void;
const FiveMinutes = 5 * 60 * 1000;
const debug = false;
const InitialPosition = new Point(4, 3);
interface Vars {
	InitialPosition: Point;
	zone: Zone;
	char: Char;
	monster: Monster;
}

export type describeMonsterMovement = (
	type: Char.MovementType,
	block: (ctx: GameplayContext, tick: (input?: string) => Promise<void>, vars: Vars) => void
) => void;
const makeFunction =
	(describe: any): describeMonsterMovement =>
	(
		type: Char.MovementType,
		block: (ctx: GameplayContext, tick: (input?: string) => Promise<void>, vars: Vars) => void
	) =>
		describe(
			"WebFun.Acceptance.MonsterMovement." + type.name,
			withTimeout(FiveMinutes, () => {
				const ctx = new GameplayContext(debug);

				const vars: Vars = {
					monster: null,
					char: null,
					zone: null,
					InitialPosition
				};

				beforeAll(async () => {
					await ctx.prepare(loadGameData);
					ctx.buildEngine();

					const story = buildStory(ctx.engine.assets);
					try {
						srand(0xdead);
						ctx.setupEngine(story, "", debug);
						ctx.engine.hero.location = new Point(4, 6);
						await ctx.engine.metronome.stop();
					} catch (e) {}
				});

				block(ctx, tick, vars);

				afterAll(async () => await ctx.cleanup());

				async function tick(input = "."): Promise<void> {
					return new Promise(async resolve => {
						try {
							await ctx.engine.metronome.stop();
							ctx.onInputEnd = async () => {
								await ctx.engine.metronome.stop();
								ctx.engine.inputManager.removeListeners();
								inputManager.removeEventListener(
									ReplayingInputManager.Event.InputEnd,
									ctx.onInputEnd
								);
								ctx.onInputEnd = () => void 0;
								resolve();
							};
							const inputManager = ctx.engine.inputManager as ReplayingInputManager;
							inputManager.addEventListener(ReplayingInputManager.Event.InputEnd, ctx.onInputEnd);
							inputManager.input = input;
							ctx.engine.inputManager.addListeners();
							ctx.engine.metronome.start();
						} catch (e) {}
					});
				}

				function buildStory(assets: AssetManager): Story {
					vars.zone = buildZone(assets);
					vars.zone.id = assets.getAll(Zone).length;
					vars.char = buildChar(type, assets);
					vars.monster = buildMonster(assets);
					vars.monster.face = vars.char;
					vars.monster.position = new Point(InitialPosition);
					vars.monster.id = vars.zone.monsters.length;
					vars.zone.monsters.push(vars.monster);

					assets.populate(Zone, assets.getAll(Zone).concat([vars.zone]));

					return new SimulatedStory(
						null,
						null,
						null,
						null,
						vars.zone,
						Array.Repeat(vars.zone, 8),
						assets
					);
				}

				function buildZone(assets: AssetManager): Zone {
					const zone = new Zone(
						4,
						{
							width: 9,
							height: 9,
							tileIDs: new Int16Array(),
							zoneType: Zone.Type.None.rawValue,
							planet: Zone.Planet.None.rawValue,
							npcIDs: new Int16Array(),
							providedItemIDs: new Int16Array(),
							requiredItemIDs: new Int16Array(),
							goalItemIDs: new Int16Array(),
							monsters: [],
							actions: [],
							hotspots: [],
							unknown: -1
						},
						assets
					);
					zone.type = Zone.Type.Room;
					zone.planet = Zone.Planet.None;
					zone.size = new Size(9, 9);
					zone.tileIDs = new Int16Array(9 * 9 * 3);
					const innerRegion = zone.bounds.inset(1, 1);

					const floor = assets.get(Tile, 306);
					const wall = assets.get(Tile, 305);

					for (let y = 0; y < zone.size.height; y++) {
						for (let x = 0; x < zone.size.width; x++) {
							zone.setTile(null, x, y, Zone.Layer.Roof);
							zone.setTile(
								innerRegion.contains(new Point(x, y)) ? null : wall,
								x,
								y,
								Zone.Layer.Object
							);
							zone.setTile(floor, x, y, Zone.Layer.Floor);
						}
					}

					return zone;
				}

				function buildMonster(assets: AssetManager): Monster {
					const c = assets.getAll(Char).length - 1;
					return new Monster(
						0,
						{
							x: 0,
							y: 0,
							waypoints: new Int32Array(),
							character: c,
							loot: -1,
							dropsLoot: false
						},
						assets
					);
				}

				function buildChar(movementType: Char.MovementType, assets: AssetManager): Char {
					const charTiles = assets
						.getAll(Tile)
						.filter(t => t.hasAttributes(Tile.Attributes.Character));

					const frame1 = charTiles.slice(1, 9).map(i => i.id);
					const frame2 = charTiles
						.slice(9, 17)
						.concat(charTiles)
						.map(i => i.id);
					const frame3 = charTiles
						.slice(17, 25)
						.concat(charTiles)
						.map(i => i.id);
					const char = new Char(
						assets.getAll(Char).length,
						{
							name: "Test Monster",
							type: Char.Type.Enemy.rawValue,
							movementType: movementType.rawValue,
							health: 1,
							damage: 0,
							reference: -1,
							frame1: new Int16Array(frame1),
							frame2: new Int16Array(frame2),
							frame3: new Int16Array(frame3),
							probablyGarbage1: -1,
							probablyGarbage2: -1
						},
						assets
					);

					assets.populate(Char, assets.getAll(Char).concat([char]));
					return char;
				}
			})
		);

export const describeMonsterMovement = makeFunction(describe);
export const xdescribeMonsterMovement = makeFunction(xdescribe);
export const fdescribeMonsterMovement = makeFunction(fdescribe);
