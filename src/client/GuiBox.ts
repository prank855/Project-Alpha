import { Vector2 } from '../shared/Vector2';
import { CanvasCreator } from './CanvasCreator';
import { GameComponent } from '../shared/GameComponent';
import { Camera } from './Camera';

export class GuiBox extends GameComponent {
	width: number = 20;
	height: number = 20;
	fillColor: string = 'Black';
	hoverColor: string = '';
	hoverStrokeSize: number = 1;

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
			var ctx = CanvasCreator.context;
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
			}
		}

		//TODO: check if box clicked
		//this.onClick();
	}

	onHover() {}

	onClick() {}
}
