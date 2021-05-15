import { SpriteLayer } from './SpriteLayer';
import { Sprite } from './Sprite';
import { CanvasCreator } from './CanvasCreator';

export class SpriteManager {
	static sprites: Sprite[] = [];
	static layers: HTMLCanvasElement[] = new Array(
		Object.keys(SpriteLayer).length / 2
	)
		.fill(undefined)
		.map(() => {
			return document.createElement('canvas');
		});

	static render() {
		for (var l of this.layers) {
			l.width = innerWidth;
			l.height = innerHeight;
		}

		for (var s of this.sprites) {
			var ctx = this.layers[s.layer].getContext('2d');
			if (ctx) s.render(ctx);
		}
		for (var i = 0; i < this.layers.length; i++) {
			CanvasCreator.context?.drawImage(this.layers[i], 0, 0);
		}
	}
}
