class Sound {
	public readonly id: number;
	public readonly file: string;
	public representation: any;

	constructor(id: number, file: string) {
		this.id = id;
		this.file = file;
	}
}
export default Sound;
