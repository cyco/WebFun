import { default as BatchOperation, Event } from '/util/batch-operation';

export default class extends BatchOperation {
    constructor(image, url) {
        super();
		
        this._image = image;
        this._url = url;
    }

    start() {
        const self = this;
        self._load();
    }

    _load() {
        this.dispatchEvent(Event.Start);
        const self = this;
        self._imageDidLoad();
    }

    _imageDidLoad() {
        this._image._image.src = this._url;
        this.dispatchEvent(Event.Finish);
    }
}
