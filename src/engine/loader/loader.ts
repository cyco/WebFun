import LoaderEvent from "./loader-event";

interface Loader {
	onfail: (e: LoaderEvent) => void;
	onprogress: (e: LoaderEvent) => void;
	onloadsetupimage: (e: LoaderEvent) => void;
	onload: (e: LoaderEvent) => void;

	load(): void;
}

export default Loader;
