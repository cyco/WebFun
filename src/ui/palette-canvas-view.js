import CanvasView from './canvas-view';
import {rgba, rgb} from '/util';

export default class PaletteCanvasView extends CanvasView {
	constructor(){
		super();
		this.element.classList.add('pixelated');
	}
	
	draw(){
		super.draw();
		
		const size = this.size;
		
		for(let y=0; y < size.height; y++) {
			for(let x=0; x < size.width; x++) {
				this.setColor(this.getColorIndex(x,y,size.width));
				this.context.fillRect(x,y,1,1);
			}
		}
	}
	
	setColor(idx) {
		this.context.fillStyle = this.getColor(idx);
	}
	
	getColorIndex(x,y, width = this.size.width) {
		return this._pixelData[x + y * width];
	}
	
	getColor(index) {
		if(index === 0) return rgba(0,0,0,0);
		
		const p = this._palette;
		return rgb(p[4*index+2], p[4*index+1], p[4*index+0]);
	}
	
	getColorAt(x,y){
		const index = this.getColorIndex(x,y);
		return this.getColor(index);
	}
	
	get palette() {
		return this._palette;
	}

	set palette(p) {
		this._palette = p;
		this.setShouldDraw();
	}

	get pixelData() {
		return this._pixelData;
	}

	set pixelData(p) {
		this._pixelData = p;
		this.setShouldDraw();
	}
}