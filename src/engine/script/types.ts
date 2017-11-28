import Engine from "../engine";
import { Action, Instruction, Zone } from "../objects";

type int16 = number;
type Result = number;

export type ConditionImplementation = (args: int16[], zone: Zone, engine: Engine) => Promise<boolean>;
export type InstructionImplementation = (instruction: Instruction, engine: Engine, action: Action) => Promise<Result>;

enum ResultFlags {
	OK = 0,
	UpdateTiles = 1 << 0,
	UpdateText = 1 << 1,
	UpdateSound = 1 << 2,
	UpdateHero = 1 << 3,
	UpdateViewport = 1 << 4,
	UpdateHotspot = 1 << 5,
	UpdateNPC = 1 << 6,
	DidRedraw = 1 << 7,
	UpdateInventory = 1 << 8,
	UpdateGameState = 1 << 9,
	UpdateZone = 1 << 10,
	UpdateHealth = 1 << 11,
	Wait = 1 << 12
}


class Type {
	public static readonly Number = new Type();
	public static readonly TileID = new Type();
	public static readonly ZoneX = new Type();
	public static readonly ZoneY = new Type();
	public static readonly ZoneZ = new Type();
	public static readonly NPCID = new Type();
	public static readonly ZoneID = new Type();
	public static readonly HotspotID = new Type();
	public static readonly SoundID = new Type();
	public static readonly Unused = new Type();
}

export { int16, ResultFlags, Result, Type };


