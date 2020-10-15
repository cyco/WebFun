import { Tile, Hotspot } from "src/engine/objects";
import { Renderer } from "src/engine/rendering";
import { Point, rgba } from "src/util";
import CanvasRenderer from "src/app/rendering/canvas/canvas-renderer";

export default (renderer: Renderer, hotspots: Hotspot[], offset: Point): void => {
	if (!(renderer.fillRect instanceof Function)) return;

	let c = 0;
	let l: Point = new Point(-1, -1);
	hotspots.forEach((h: Hotspot): void => {
		renderer.fillRect(
			(h.x + offset.x) * Tile.WIDTH,
			(h.y + offset.y) * Tile.HEIGHT,
			Tile.WIDTH,
			Tile.HEIGHT,
			h.enabled ? rgba(0, 255, 0, 0.3) : rgba(255, 0, 0, 0.3)
		);

		if (!(renderer instanceof CanvasRenderer)) return;
		if (!h.location.isEqualTo(l)) c = 0;
		l = h.location;

		const style = {
			font: '10px "Anonymous Pro", monospace',
			fillStyle: "rgba(255, 255, 255, 0.6)",
			shadowColor: "rgba(0,0,0,0)",
			shadowBlur: 0,
			shadowOffsetX: 0,
			shadowOffsetY: 0
		};
		const location = new Point((h.x + offset.x) * Tile.WIDTH, c * 10 + (h.y + offset.y) * Tile.HEIGHT);
		renderer.renderText(shortName(h.type), location, style);
		c++;
	});

	function shortName(t: Hotspot.Type): string {
		switch (t) {
			case Hotspot.Type.DropQuestItem:
				return "quest";
			case Hotspot.Type.DropUniqueWeapon:
				return "dpuni";
			case Hotspot.Type.DropMap:
				return "dpmap";
			case Hotspot.Type.DropItem:
				return "dpitm";
			case Hotspot.Type.DropWeapon:
				return "dpwpn";
			case Hotspot.Type.SpawnLocation:
				return "spawn";
			case Hotspot.Type.NPC:
				return "npc";
			case Hotspot.Type.Lock:
				return "lock";
			case Hotspot.Type.Teleporter:
				return "telep";
			case Hotspot.Type.Unused:
				return "none";
			case Hotspot.Type.DoorIn:
				return "doorin";
			case Hotspot.Type.DoorOut:
				return "dooout";
			case Hotspot.Type.VehicleTo:
				return "vehto";
			case Hotspot.Type.VehicleBack:
				return "vehba";
			case Hotspot.Type.ShipToPlanet:
				return "shipto";
			case Hotspot.Type.ShipFromPlanet:
				return "shipfr";
		}
	}
};
