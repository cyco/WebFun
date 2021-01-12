import { Zone, Tile } from "src/engine/objects";
import { download } from "src/util";

class ZoneExporter {
	async export(zone: Zone, tilesetPath: string, filename: string): Promise<void> {
		const doc = new DOMParser().parseFromString(
			`<?xml version="1.0" encoding="UTF-8"?><map></map>`,
			"text/xml"
		);

		const map = doc.documentElement;
		map.setAttribute("version", "1.4");
		map.setAttribute("tiledversion", "1.4.3");
		map.setAttribute("orientation", "orthogonal");
		map.setAttribute("renderorder", "right-down");
		map.setAttribute("tilewidth", `${Tile.WIDTH}`);
		map.setAttribute("tileheight", `${Tile.HEIGHT}`);
		map.setAttribute("width", `${zone.size.width}`);
		map.setAttribute("height", `${zone.size.height}`);
		map.setAttribute("nextlayerid", "3");
		map.setAttribute("nextobjectid", "4");
		map.setAttribute("infinite", "0");

		const tileset = doc.createElement("tileset");
		tileset.setAttribute("firstgid", "1");
		tileset.setAttribute("source", tilesetPath);
		map.appendChild(tileset);

		for (let z = 0; z < Zone.LAYERS; z++) {
			const layer = doc.createElement("layer");
			layer.setAttribute("name", `${Zone.Layer[z]}`);
			layer.setAttribute("id", `${z + 1}`);
			layer.setAttribute("width", `${zone.size.width}`);
			layer.setAttribute("height", `${zone.size.height}`);

			const data = doc.createElement("data");
			data.setAttribute("encoding", "csv");
			data.textContent += "\n";
			for (let y = 0; y < zone.size.height; y++) {
				for (let x = 0; x < zone.size.width; x++) {
					data.textContent += zone.getTileID(x, y, z) + 1;
					if (y !== zone.size.height - 1 || x !== zone.size.width - 1) {
						data.textContent += ",";
					}
				}
				data.textContent += "\n";
			}
			layer.appendChild(data);
			map.appendChild(layer);
		}

		const serializer = new XMLSerializer();
		return await download(
			serializer.serializeToString(doc),
			`${filename}.tmx`,
			"application/binary"
		);
	}
}

export default ZoneExporter;
