import LoaderInterface, { LoaderEvent } from "../loader";

class Loader implements LoaderInterface {
	public onfail: (_: LoaderEvent) => void;
	public onprogress: (_: LoaderEvent) => void;
	public onloadsetupimage: (_: LoaderEvent) => void;
	public onloadpalette: (_: LoaderEvent) => void;
	public onload: (_: LoaderEvent) => void;

	load(): void {}
}

export default Loader;
