import { AssetManager } from './AssetManager';
import { Vector2 } from '../shared/Vector2';
import { Camera } from './Camera';
import { CanvasCreator } from './CanvasCreator';
import { SpriteRenderer } from './SpriteRenderer';

export class Sprite {
	origin: Vector2;
	width: number;
	height: number;
	image: HTMLCanvasElement[];
	position: Vector2 = Vector2.zero();
	constructor(image: HTMLCanvasElement[], origin: Vector2, scale?: number) {
		if (!scale) {
			scale = 1;
		}
		this.image = image;
		this.width = image[0].width * scale;
		this.height = image[0].height * scale;
		this.origin = origin;
	}
	render() {
		//TODO: if sprite draw is bigger than canvas only draw from that specific region of image
		let ctx = CanvasCreator.context;
		let screenSpace = Camera.toScreenSpace(this.position);
		if (
			screenSpace.x - this.width * this.origin.x * Camera.currZoom <
				innerWidth &&
			screenSpace.x + this.width * this.origin.x * Camera.currZoom > 0 &&
			screenSpace.y - this.height * this.origin.y * Camera.currZoom <
				window.innerHeight &&
			screenSpace.y + this.height * this.origin.y * Camera.currZoom > 0
		) {
			for (var i = this.image.length - 1; i > 0; i--) {
				if (this.width * Camera.currZoom < this.image[i].width / 2) {
					SpriteRenderer.drawCount++;
					ctx?.drawImage(
						this.image[i],
						screenSpace.x - this.width * this.origin.x * Camera.currZoom,
						screenSpace.y - this.height * this.origin.y * Camera.currZoom,
						this.width * Camera.currZoom,
						this.height * Camera.currZoom
					);
					return;
				}
			}
			SpriteRenderer.drawCount++;
			ctx?.drawImage(
				this.image[0],
				screenSpace.x - this.width * this.origin.x * Camera.currZoom,
				screenSpace.y - this.height * this.origin.y * Camera.currZoom,
				this.width * Camera.currZoom,
				this.height * Camera.currZoom
			);
		}
	}
}
