import { SpriteLayer } from './SpriteLayer';
import { Vector2 } from '../shared/Vector2';
import { Camera } from './Camera';
import { SpriteRenderer } from './SpriteRenderer';
import { Align } from './GUI/Align';

export class Sprite {
	align: Align;
	width: number;
	height: number;
	image: HTMLCanvasElement[];
	position: Vector2 = Vector2.zero();
	layer: SpriteLayer = SpriteLayer.FOREGROUND;
	antialias: boolean = true;
	screenSpace: boolean = false;
	constructor(
		image: HTMLCanvasElement[],
		layer: SpriteLayer,
		align: Align,
		scale: number,
		antialias?: boolean,
		screenSpace?: boolean
	) {
		this.image = image;
		this.width = image[0].width * scale;
		this.height = image[0].height * scale;
		this.align = align;
		this.layer = layer;
		if (antialias != null) {
			this.antialias = antialias;
		}
		if (screenSpace != null) {
			this.screenSpace = screenSpace;
		}
	}
	render(ctx: CanvasRenderingContext2D, camera: Camera) {
		//TODO: if sprite draw is bigger than canvas only draw from that specific region of image

		let screenSpace: Vector2;
		if (!this.screenSpace) {
			screenSpace = camera.toScreenSpace(this.position);
		} else {
			screenSpace = Vector2.copy(this.position);
		}
		var origin = Vector2.Align(this.align);
		if (
			screenSpace.x - this.width * origin.x * camera.currZoom < innerWidth &&
			screenSpace.x + this.width * origin.x * camera.currZoom > 0 &&
			screenSpace.y - this.height * origin.y * camera.currZoom <
				window.innerHeight &&
			screenSpace.y + this.height * origin.y * camera.currZoom > 0
		) {
			for (var i = this.image.length - 1; i >= 0; i--) {
				if (this.width * camera.currZoom < this.image[i].width / 2) {
					SpriteRenderer.drawCount++;
					ctx?.drawImage(
						this.image[i],
						screenSpace.x - this.width * origin.x * camera.currZoom,
						screenSpace.y - this.height * origin.y * camera.currZoom,
						this.width * camera.currZoom,
						this.height * camera.currZoom
					);

					/*
					if (ctx) {
						ctx.fillStyle = 'White';
						ctx?.fillText(
							`${i} MipMap level`,
							screenSpace.x - this.width * origin.x * camera.currZoom,
							screenSpace.y - this.height * origin.y * camera.currZoom
						);
					}
					*/

					return;
				}
			}

			SpriteRenderer.drawCount++;
			ctx?.drawImage(
				this.image[0],
				screenSpace.x - this.width * origin.x * camera.currZoom,
				screenSpace.y - this.height * origin.y * camera.currZoom,
				this.width * camera.currZoom,
				this.height * camera.currZoom
			);
		}
	}
}
