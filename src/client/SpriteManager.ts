import { SpriteLayer } from './SpriteLayer';
import { Sprite } from './Sprite';
import { CanvasCreator } from './CanvasCreator';
import { Game } from '../shared/Game';
import { Camera } from './Camera';

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
		var cam = Game.singleton.currentScene
			.findGameObjectByName('Camera')
			?.getComponent('Camera') as Camera;
		if (cam) {
			for (var s of this.sprites) {
				var ctx = this.layers[s.layer].getContext('2d');
				if (ctx) {
					if (s.antialias) {
						s.render(ctx, cam);
					} else {
						ctx.imageSmoothingEnabled = false;
						s.render(ctx, cam);
						ctx.imageSmoothingEnabled = true;
					}
				}
			}
			for (var i = 0; i < this.layers.length; i++) {
				CanvasCreator.context?.drawImage(this.layers[i], 0, 0);
			}
		}
	}
}
