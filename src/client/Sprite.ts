import { SpriteLayer } from './SpriteLayer';
import { Vector2 } from '../shared/Vector2';
import { Camera } from './Camera';
import { SpriteRenderer } from './SpriteRenderer';

export class Sprite {
	origin: Vector2;
	width: number;
	height: number;
	image: HTMLCanvasElement[];
	position: Vector2 = Vector2.zero();
	layer: SpriteLayer = SpriteLayer.FOREGROUND;
	constructor(
		image: HTMLCanvasElement[],
		layer: SpriteLayer,
		origin: Vector2,
		scale: number
	) {
		this.image = image;
		this.width = image[0].width * scale;
		this.height = image[0].height * scale;
		this.origin = origin;
		this.layer = layer;
	}
	render(ctx: CanvasRenderingContext2D, camera: Camera) {
		//TODO: if sprite draw is bigger than canvas only draw from that specific region of image
		let screenSpace = camera.toScreenSpace(this.position);
		if (
			screenSpace.x - this.width * this.origin.x * camera.currZoom <
				innerWidth &&
			screenSpace.x + this.width * this.origin.x * camera.currZoom > 0 &&
			screenSpace.y - this.height * this.origin.y * camera.currZoom <
				window.innerHeight &&
			screenSpace.y + this.height * this.origin.y * camera.currZoom > 0
		) {
			for (var i = this.image.length - 1; i >= 0; i--) {
				if (this.width * camera.currZoom < this.image[i].width / 2) {
					SpriteRenderer.drawCount++;
					ctx?.drawImage(
						this.image[i],
						screenSpace.x - this.width * this.origin.x * camera.currZoom,
						screenSpace.y - this.height * this.origin.y * camera.currZoom,
						this.width * camera.currZoom,
						this.height * camera.currZoom
					);
					/*
					if (ctx) {
						ctx.fillStyle = 'Black';
						ctx?.fillText(
							`${i} MipMap level`,
							screenSpace.x - this.width * this.origin.x * Camera.currZoom,
							screenSpace.y - this.height * this.origin.y * Camera.currZoom
						);
					}
					*/
					return;
				}
			}

			SpriteRenderer.drawCount++;
			ctx?.drawImage(
				this.image[0],
				screenSpace.x - this.width * this.origin.x * camera.currZoom,
				screenSpace.y - this.height * this.origin.y * camera.currZoom,
				this.width * camera.currZoom,
				this.height * camera.currZoom
			);
		}
	}
}
