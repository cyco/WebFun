import { MutableZone, MutableNPC, MutableChar } from "src/engine/mutable-objects";
import { Char, Zone, Tile } from "src/engine/objects";
import { srand, Size, Point } from "src/util";
import { SimulatedStory } from "src/debug";
import { Story, AssetManager } from "src/engine";
import { Planet } from "src/engine/types";
import { GameplayContext } from "src/debug/automation/test";
import loadGameData from "test/helpers/game-data";
import { ReplayingInputManager } from "src/debug/automation";

declare let withTimeout: (t: number, block: () => void) => () => void;
const FiveMinutes = 5 * 60 * 1000;
const debug = false;
const InitialPosition = new Point(4, 3);
interface Vars {
	InitialPosition: Point;
	zone: MutableZone;
	char: MutableChar;
	npc: MutableNPC;
}

export type DescribeNPCMovement = (
	type: Char.MovementType,
	block: (ctx: GameplayContext, tick: (input?: string) => Promise<void>, vars: Vars) => void
) => void;
const makeFunction = (describe: any): DescribeNPCMovement => (
	type: Char.MovementType,
	block: (ctx: GameplayContext, tick: (input?: string) => Promise<void>, vars: Vars) => void
) =>
	describe(
		"WebFun.Acceptance.NPCMovement." + type.name,
		withTimeout(FiveMinutes, () => {
			const ctx = new GameplayContext(debug);
			const vars: Vars = {
				npc: null,
				char: null,
				zone: null,
				InitialPosition
			};

			beforeAll(async () => {
				await ctx.prepare(loadGameData);
				ctx.buildEngine();
				(window as any).engine = ctx.engine;

				const story = buildStory(ctx.engine.assetManager);
				try {
					srand(0xdead);
					ctx.setupEngine(story, [], debug);
					ctx.engine.hero.location = new Point(4, 6);
				} catch (e) {}
			});

			block(ctx, tick, vars);

			afterAll(async () => await ctx.cleanup());

			async function tick(input = "."): Promise<void> {
				return new Promise(async resolve => {
					try {
						ctx.onInputEnd = () => {
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
						inputManager.input = input.split("").map(t => t.trim());
						ctx.engine.inputManager.addListeners();
					} catch (e) {}
				});
			}

			function buildStory(assets: AssetManager): Story {
				vars.zone = buildZone(assets);
				vars.zone.id = assets.getAll(Zone).length;
				vars.npc = buildNPC();
				vars.char = buildChar(type, assets);
				vars.npc.face = vars.char;
				vars.npc.position = new Point(InitialPosition);
				vars.zone.npcs.push(vars.npc);

				assets.populate(Zone, assets.getAll(Zone).concat([vars.zone]));

				return new SimulatedStory(
					null,
					null,
					null,
					null,
					vars.zone,
					Array.Repeat(vars.zone, 8),
					assets.getAll(Zone)
				);
			}

			function buildZone(assets: AssetManager): MutableZone {
				const zone = new MutableZone();
				zone.type = Zone.Type.Room;
				zone.planet = Planet.NONE;
				zone.tileStore = assets.getAll(Tile);
				zone.zoneStore = assets.getAll(Zone);
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

			function buildNPC(): MutableNPC {
				const npc = new MutableNPC();
				npc.id = 0;
				npc.enabled = true;
				return npc;
			}

			function buildChar(movementType: Char.MovementType, assets: AssetManager): Char {
				const char = new MutableChar();
				char.id = assets.getAll(Char).length;
				char.movementType = movementType;
				const charTiles = assets.getAll(Tile).filter(t => t.isCharacter());

				const frame1 = new Char.Frame(charTiles.slice(1, 9));
				const frame2 = new Char.Frame(charTiles.slice(9, 17).concat(charTiles));
				const frame3 = new Char.Frame(charTiles.slice(17, 25).concat(charTiles));
				char.frames = [frame1, frame2, frame3];

				assets.populate(Char, assets.getAll(Char).concat([char]));
				return char;
			}
		})
	);

export const describeNPCMovement = makeFunction(describe);
export const xdescribeNPCMovement = makeFunction(xdescribe);
export const fdescribeNPCMovement = makeFunction(fdescribe);
