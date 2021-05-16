import { Vector2 } from './../shared/Vector2';
import { CanvasCreator } from './CanvasCreator';
import { GameComponent } from '../shared/GameComponent';
import { Camera } from './Camera';
import { Input } from './Input';

export class ButtonRenderer extends GameComponent {
	width: number = 20;
	height: number = 20;
	fillColor: string = 'Black';
	text: string = '';
	textColor: string = 'White';
	textSize: number = 12;
	font: string = 'Georgia';

	camera: Camera | null = null;
	constructor() {
		super('ButtonRenderer');
	}
	update() {
		if (!this.camera) {
			this.camera = this.parent?.scene
				?.findGameObjectByName('Camera')
				?.getComponent('Camera') as Camera;
			return;
		}
		if (this.parent) {
			var ctx = CanvasCreator.context;
			if (ctx) {
				var screenSpace = this.camera.toScreenSpace(
					this.parent.transform.position
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
				ctx.fillRect(boxPos.x, boxPos.y, boxSize.x, boxSize.y);
				ctx.fillStyle = this.textColor;
				ctx.font = `${this.textSize * this.camera.currZoom}px ${this.font}`;
				var measureText = ctx.measureText(this.text);
				ctx.fillText(
					this.text,
					boxPos.x + boxSize.x / 2 - measureText.width / 2,
					boxPos.y +
						boxSize.y / 2 +
						(measureText.actualBoundingBoxAscent +
							measureText.actualBoundingBoxDescent) /
							2
				);

				var mousePos = Vector2.copy(Input.mousePos);

				if (
					mousePos.x > boxPos.x &&
					mousePos.x < boxPos.x + boxSize.x &&
					mousePos.y > boxPos.y &&
					mousePos.y < boxPos.y + boxSize.y
				) {
					ctx.fillRect(mousePos.x, mousePos.y, 5, 5);
					this.onHover();
				}
			}
		}

		//TODO: check if box clicked
		//this.onClick();
	}

	onHover() {
		console.log('Button Hovered!');
	}

	onClick() {
		console.log('Button Clicked!');
	}
}
