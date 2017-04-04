import { default as BatchOperation, Event } from '/util/batch-operation';
import Image from './image';

export default class extends BatchOperation {
    constructor(image) {
        super();

        this._image = image;

        this._data = image._data;
        this._width = image._width;
        this._height = image._height;
    }

    start() {
        const self = this;
        self._load();
    }

    _load() {
        this.dispatchEvent(Event.Start);

        const self = this;
        const paletteData = Image.GetPalette();
        const width = this._width;
        const height = this._height;
        const imageData = new window.ImageData(width, height);
        const pixelData = imageData.data;
        const size = this._width * this._height;

        if (!this._data) {
            this._imageDidLoad();
            return;
        }

        for (let i = 0; i < size; i++) {
            const paletteIndex = this._data[i] * 4;

            pixelData[4 * i + 0] = paletteData[paletteIndex + 2];
            pixelData[4 * i + 1] = paletteData[paletteIndex + 1];
            pixelData[4 * i + 2] = paletteData[paletteIndex + 0];
            pixelData[4 * i + 3] = paletteIndex === 0 ? 0x00 : 0xFF;
        }

        const canvas = document.createElement('canvas');
        canvas.classList.add('pixelated');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        context.putImageData(imageData, 0, 0);

        const src = this.src = canvas.toDataURL();
        this._cachedImage = new window.Image(width, height);
        this._cachedImage.classList.add('pixelated');
        this._cachedImage.onload = () => self._imageDidLoad();
        this._cachedImage.src = src;
    }

    _imageDidLoad() {
        this._image._image = this._cachedImage;

        this._cachedImage = null;
        delete this._cachedImage;
        delete this._data;

        this.dispatchEvent(Event.Finish);
    }
}
