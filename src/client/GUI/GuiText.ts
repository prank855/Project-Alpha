import { SpriteLayer } from './../SpriteLayer';
import { SpriteManager } from './../SpriteManager';
import { Vector2 } from './../../shared/Vector2';
import { GameComponent } from './../../shared/GameComponent';
import { isGUI } from './isGUI';
import { Camera } from '../Camera';
import { Align } from './Align';
export class GuiText extends GameComponent implements isGUI {
	text: string = '';
	textColor: string = 'White';
	textSize: number = 12;
	textFont: string = 'Georgia';

	textStroke: boolean = false;
	textStrokeStyle: string = 'Black';
	textStrokeSize: number = 1;

	camera: Camera | null = null;
	align = Align.CENTER;

	constructor() {
		super('GuiText');
	}
	update() {
		if (!this.camera) {
			this.camera = this.parent?.scene
				?.findGameObjectByName('Camera')
				?.getComponent('Camera') as Camera;
			return;
		}
		if (this.parent) {
			var ctx = SpriteManager.layers[SpriteLayer.GUI].getContext('2d');
			if (ctx) {
				var screenSpace = this.camera.toScreenSpace(
					this.parent.getTransform().position
				);

				var measureText = ctx.measureText(this.text);
				var origin = Vector2.Align(this.align);
				ctx.font = `${this.textSize * this.camera.currZoom}px ${this.textFont}`;
				if (this.textStroke) {
					ctx.strokeStyle = this.textStrokeStyle;
					ctx.lineWidth = this.textStrokeSize * this.camera.currZoom;
					ctx.strokeText(
						this.text,
						screenSpace.x - origin.x * measureText.width,
						screenSpace.y +
							origin.y *
								(measureText.actualBoundingBoxAscent +
									measureText.actualBoundingBoxDescent)
					);
				}

				ctx.fillStyle = this.textColor;
				ctx.fillText(
					this.text,
					screenSpace.x - origin.x * measureText.width,
					screenSpace.y +
						origin.y *
							(measureText.actualBoundingBoxAscent +
								measureText.actualBoundingBoxDescent)
				);
			}
		}
	}
	onHover() {}
	onClick() {}
}
