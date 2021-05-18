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
	textFont: string = 'Ubuntu';

	textStroke: boolean = false;
	textStrokeStyle: string = 'Black';
	textStrokeSize: number = 1;

	camera: Camera | null = null;
	align = Align.CENTER;

	//TODO: cache text to canvas for performance :)

	// private text : string = '';
	// setText(text : String){ render temporary canvas with drawn text }

	constructor() {
		super('GuiText');
	}

	lateUpdate() {
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
				var origin = Vector2.Align(this.align);
				ctx.font = `${this.textSize * this.camera.currZoom}px ${this.textFont}`;
				var measureText = ctx.measureText(this.text);
				if (this.textStroke) {
					ctx.strokeStyle = this.textStrokeStyle;
					ctx.lineWidth = this.textStrokeSize * this.camera.currZoom;
					ctx.strokeText(
						this.text,
						screenSpace.x - measureText.width * origin.x,
						screenSpace.y + origin.y * measureText.actualBoundingBoxAscent
					);
				}
				ctx.fillStyle = this.textColor;
				ctx.fillText(
					this.text,
					screenSpace.x - measureText.width * origin.x,
					screenSpace.y + origin.y * measureText.actualBoundingBoxAscent
				);
			}
		}
	}
	onHover() {}
	onClick() {}
}
