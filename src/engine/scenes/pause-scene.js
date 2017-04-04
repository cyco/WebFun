import Scene from '/engine/scenes/scene';
import Tile from '/engine/objects/tile';

export default class PauseScene extends Scene {
    constructor() {
        super();

        const image = new Image();
        image.width = Tile.WIDTH;
        image.height = Tile.HEIGHT;
        image.src = 'rsrc/img/pause.gif';
        this._image = image;
    }

    render(renderer) {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                renderer.renderImageNode(this._image, x * Tile.WIDTH, y * Tile.HEIGHT);
            }
        }
    }

    update(ticks) {
        const engine = this.engine;
        const inputManager = engine.inputManager;
        if (!inputManager.pause) {
            engine.sceneManager.popScene();
        }
    }
}