import "console.image";

declare global {
	interface Console {
		image(source: string): void;
	}
}

export default console.image;
