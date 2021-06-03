import { Vector2 } from '../shared/Vector2';
import { CanvasCreator } from './CanvasCreator';
import { GameObject } from '../shared/GameObject';
import { GameComponent } from '../shared/GameComponent';
import { CameraController } from './CameraController';

export class Camera extends GameComponent {
	currZoom: number = 1;
	position: Vector2 = Vector2.zero();
	//TODO: rotation
	// rotation : number = 0;
	target: GameObject | null = null;
	boundBoxSize: number = 240;
	speed: number = 1;
	zoom: number = 1;
	size: number = 500;
	zoomSpeed: number = 1.5;
	zoomFactor = 8;

	controller: CameraController | null = null;

	constructor() {
		super('Camera');
	}

	update() {
		this.currZoom = this.getZoom();
		if (this.controller) {
			this.controller.update(this);
		}
	}

	getZoom(): number {
		let min = 0;
		if (window.innerHeight < window.innerWidth) {
			min = innerHeight;
		} else {
			min = innerWidth;
		}
		return this.zoom * (min / this.size);
	}

	toScreenSpace(vec: Vector2): Vector2 {
		return new Vector2(
			vec.x * this.currZoom -
				this.position.x * this.currZoom +
				window.innerWidth / 2,
			-vec.y * this.currZoom +
				this.position.y * this.currZoom +
				window.innerHeight / 2
		);
	}

	toWorldSpace(vec: Vector2): Vector2 {
		//TODO: this
		//https://www.wolframalpha.com/input/?i=x%3D%28a*z+%29+-+%28b*z%29+%2B+%28w+%2F+2%29+solve+b
		return Vector2.copy(vec);
	}

	onDebug() {
		let ctx = CanvasCreator.context;
		if (ctx != null) {
			let screenSpace = this.toScreenSpace(this.position);
			ctx.strokeStyle = 'LightBlue';
			ctx.strokeRect(
				screenSpace.x - this.boundBoxSize * this.currZoom,
				screenSpace.y - this.boundBoxSize * this.currZoom,
				this.boundBoxSize * 2 * this.currZoom,
				this.boundBoxSize * 2 * this.currZoom
			);
		}
	}
}
