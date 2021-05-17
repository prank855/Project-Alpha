import { isGUI } from './isGUI';
import { GameComponent } from '../../shared/GameComponent';
import { Vector2 } from '../../shared/Vector2';
import { Camera } from '../Camera';

import { Input } from '../Input';
import { Align } from './Align';
import { SpriteManager } from '../SpriteManager';
import { SpriteLayer } from '../SpriteLayer';

export class GuiButton extends GameComponent implements isGUI {
	width: number = 20;
	height: number = 20;
	fillColor: string = 'Black';
	hoverColor: string = '';
	hoverStrokeSize: number = 1;

	//TODO: this
	align = Align.CENTER;

	camera: Camera | null = null;
	constructor() {
		super('GuiButton');
	}
	private lastMouseInput: boolean = false;
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
				ctx.fillStyle = this.fillColor;
				var boxPos = new Vector2(
					screenSpace.x - this.width * 0.5 * this.camera.currZoom,
					screenSpace.y - this.height * 0.5 * this.camera.currZoom
				);
				var boxSize = new Vector2(
					this.width * this.camera.currZoom,
					this.height * this.camera.currZoom
				);
				ctx.fillStyle = this.fillColor;
				ctx.fillRect(boxPos.x, boxPos.y, boxSize.x, boxSize.y);

				var mousePos = Vector2.copy(Input.mousePos);

				if (
					mousePos.x > boxPos.x &&
					mousePos.x < boxPos.x + boxSize.x &&
					mousePos.y > boxPos.y &&
					mousePos.y < boxPos.y + boxSize.y
				) {
					if (!Input.mouseDown && this.lastMouseInput) {
						this.onClick();
					} else {
						if (this.hoverColor != '') {
							ctx.strokeStyle = this.hoverColor;
							ctx.lineWidth = this.hoverStrokeSize * this.camera.currZoom;
							ctx.strokeRect(boxPos.x, boxPos.y, boxSize.x, boxSize.y);
						}
						this.onHover();
					}
				}
			}
			this.lastMouseInput = Input.mouseDown;
		}

		//TODO: check if box clicked
		//this.onClick();
	}

	onHover() {}

	onClick() {}
}
