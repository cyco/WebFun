import Size from "./size";
import Point from "./point";

class Rectangle {
    origin: Point;
    size: Size;

    constructor(origin: Point, size: Size) {
        this.origin = origin;
        this.size = size;
    }

    contains(point: Point): boolean {
        return point.x >= this.minX && point.x <= this.maxX && point.y >= this.minY && point.y < this.maxY;
    }

    get minX(): number {
        return this.origin.x;
    }

    get maxX(): number {
        return this.origin.x + this.size.width;
    }

    get minY(): number {
        return this.origin.y;
    }

    get maxY(): number {
        return this.origin.y + this.size.height;
    }

    get area(): number {
        return this.size.area;
    }
}

export default Rectangle;
