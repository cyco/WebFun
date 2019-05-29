interface Renderer {
	clear(): void;
	redisplayTile(_x: number, _y: number): void;
	redisplayRect(_x: number, _y: number, _width: number, _height: number): void;
	redisplay(): void;
	fillBlackRect(_x: number, _y: number, _width: number, _height: number): void;
	// debug
	fillRect(x: number, y: number, width: number, height: number, color: string): void;
	renderImageData(image: any, x: number, y: number): void;
	renderImage(image: any, x: number, y: number): void;
	drawImage(image: any, atX: number, atY: number): void;
}

export default Renderer;
