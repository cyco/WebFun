import { Image } from "std.dom";

const blankImage = "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>";

Object.defineProperty(Image, "blankImage", {
	value: blankImage,
	writable: false,
	enumerable: false,
	configurable: false
});

export default blankImage;
