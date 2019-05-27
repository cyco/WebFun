interface Renderer {
	clear(): void;
	redisplayTile(_x: number, _y: number): void;
	redisplayRect(_x: number, _y: number, _width: number, _height: number): void;
	redisplay(): void;
	fillBlackRect(_x: number, _y: number, _width: number, _height: number): void;
}

export default Renderer;
