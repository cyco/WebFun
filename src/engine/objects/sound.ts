import { Sound as RawSound } from "src/engine/file-format/types";

class Sound {
	public id: number;
	public file: string;
	public representation: any;

	public constructor(id: number, data: Sound | RawSound) {
		this.id = id;
		this.file = data instanceof Sound ? data.file : data;
		this.representation = data instanceof Sound ? data.representation : null;
	}
}
export default Sound;
