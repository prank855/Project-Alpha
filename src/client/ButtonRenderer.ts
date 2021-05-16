import { CanvasCreator } from './CanvasCreator';
import { GameComponent } from '../shared/GameComponent';
import { Camera } from './Camera';

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
				ctx.fillRect(
					screenSpace.x - this.width * 0.5 * this.camera.currZoom,
					screenSpace.y - this.height * 0.5 * this.camera.currZoom,
					this.width * this.camera.currZoom,
					this.height * this.camera.currZoom
				);
				ctx.fillStyle = this.textColor;
				ctx.font = `${this.textSize * this.camera.currZoom}px ${this.font}`;
				var measureText = ctx.measureText(this.text);
				ctx.fillText(
					this.text,
					screenSpace.x -
						this.width * 0.5 * this.camera.currZoom +
						(this.width * this.camera.currZoom) / 2 -
						measureText.width / 2,
					screenSpace.y -
						this.height * 0.5 * this.camera.currZoom +
						(this.height * this.camera.currZoom) / 2 +
						(measureText.actualBoundingBoxAscent +
							measureText.actualBoundingBoxDescent) /
							2
				);
			}
		}

		//TODO: check if box clicked
		//this.onClick();
	}

	onClick() {
		console.log('Button Clicked!');
	}
}
