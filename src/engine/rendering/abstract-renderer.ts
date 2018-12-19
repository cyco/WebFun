abstract class AbstractRenderer {
	static isSupported(): boolean {
		return false;
	}

	clear() {}
	redisplayTile(_x: number, _y: number) {}
	redisplayRect(_x: number, _y: number, _width: number, _height: number) {}
	redisplay() {}
	fillBlackRect(_x: number, _y: number, _width: number, _height: number) {}
}

export default AbstractRenderer;
