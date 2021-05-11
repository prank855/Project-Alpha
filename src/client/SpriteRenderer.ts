import { GameComponent } from '../shared/GameComponent';
import { Transform } from '../shared/Transform';
import { CanvasCreator } from './CanvasCreator';

export class SpriteRenderer extends GameComponent {
	// TODO: implement sprite / sprite manager / asset loading
	static drawCount: number = 0;
	width: number = 20;
	height: number = 20;
	constructor() {
		super();
	}

	render() {
		var ctx = CanvasCreator.context;
		var transform: Transform = this.parent?.getComponent(
			'Transform'
		) as Transform;
		if (ctx != null) {
			ctx.fillStyle = 'White';
		}

		//Check if the sprite will even be seen on screen
		if (
			transform.position.x + this.width > 0 &&
			transform.position.x < CanvasCreator.canvas.width &&
			transform.position.y + this.height > 0 &&
			transform.position.y < CanvasCreator.canvas.height
		) {
			SpriteRenderer.drawCount++;
			ctx?.fillRect(
				transform?.position.x,
				transform?.position.y,
				this.width,
				this.height
			);
		}
	}

	debug() {
		var ctx = CanvasCreator.context;
		if (ctx != null) {
			ctx.strokeStyle = 'Red';
			var transform: Transform = this.parent?.getComponent(
				'Transform'
			) as Transform;
			ctx.strokeRect(
				transform?.position.x,
				transform?.position.y,
				this.width,
				this.height
			);
			ctx.fillText(
				`SpriteRenderer`,
				transform?.position.x + this.width / 2,
				transform?.position.y + this.height + 15
			);
			ctx.fillText(
				`X: ${transform.position.x
					.toFixed(2)
					.toString()}, Y: ${transform.position.y.toFixed(2).toString()}`,
				transform?.position.x + this.width / 2,
				transform?.position.y + this.height + 30
			);
			ctx.fillText(
				`Width: ${this.width}, Height: ${this.height}`,
				transform?.position.x + this.width / 2,
				transform?.position.y + this.height + 45
			);
		}
	}
}
