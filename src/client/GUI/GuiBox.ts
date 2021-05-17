import { isGUI } from './isGUI';
import { Vector2 } from '../../shared/Vector2';
import { Camera } from '../Camera';
import { GameComponent } from '../../shared/GameComponent';
import { Align } from './Align';
import { SpriteManager } from '../SpriteManager';
import { SpriteLayer } from '../SpriteLayer';

export class GuiBox extends GameComponent implements isGUI {
	width: number = 20;
	height: number = 20;
	fillColor: string = 'Black';
	hoverColor: string = '';
	hoverStrokeSize: number = 1;

	align = Align.CENTER;
	camera: Camera | null = null;
	constructor() {
		super('GuiBox');
	}
	update() {
		if (!this.camera) {
			this.camera = this.parent?.scene
				?.findGameObjectByName('Camera')
				?.getComponent('Camera') as Camera;
			return;
		}
		if (this.parent) {
			var origin = Vector2.Align(this.align);
			var ctx = SpriteManager.layers[SpriteLayer.GUI].getContext('2d');
			if (ctx) {
				var screenSpace = this.camera.toScreenSpace(
					this.parent.getTransform().position
				);
				ctx.fillStyle = this.fillColor;
				var boxPos = new Vector2(
					screenSpace.x - this.width * origin.x * this.camera.currZoom,
					screenSpace.y - this.height * origin.y * this.camera.currZoom
				);
				var boxSize = new Vector2(
					this.width * this.camera.currZoom,
					this.height * this.camera.currZoom
				);
				ctx.fillStyle = this.fillColor;
				ctx.fillRect(boxPos.x, boxPos.y, boxSize.x, boxSize.y);
			}
		}

		//TODO: check if box clicked
		//this.onClick();
	}

	onHover() {}

	onClick() {}
}
