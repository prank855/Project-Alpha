import { GameComponent } from '../shared/GameComponent';
import { Transform } from '../shared/Transform';
import { Vector2 } from '../shared/Vector2';
import { CanvasCreator } from './CanvasCreator';
import { Time } from './Time';

export class Camera extends GameComponent {
	//TODO: use transform component instead of position
	position: Vector2 = Vector2.zero();
	target: Transform | null = null;
	boundBoxSize: number = 240;
	speed: number = 1 / 4;
	//TODO: zoom
	//TODO: rotation
	constructor() {
		super();
	}
	start() {
		if (this.target != null)
			this.position = Vector2.copy(this.target?.position);
	}
	update() {
		//this.zoom *= Math.E ** (time.deltaTime * Math.log(this.zoomSpeed));
		if (this.target != null) {
			//lerp camera to target
			this.position.x +=
				(this.target.position.x - this.position.x) *
				Time.deltaTime *
				this.speed;
			this.position.y +=
				(this.target.position.y - this.position.y) *
				Time.deltaTime *
				this.speed;

			//check bounds
			if (this.target.position.x - this.position.x > this.boundBoxSize) {
				this.position.x = this.target.position.x - this.boundBoxSize;
			}
			if (this.target.position.x - this.position.x < -this.boundBoxSize) {
				this.position.x = this.target.position.x + this.boundBoxSize;
			}
			if (this.target.position.y - this.position.y > this.boundBoxSize) {
				this.position.y = this.target.position.y - this.boundBoxSize;
			}
			if (this.target.position.y - this.position.y < -this.boundBoxSize) {
				this.position.y = this.target.position.y + this.boundBoxSize;
			}
		}
	}

	toScreenSpace(vec: Vector2): Vector2 {
		let temp = Vector2.copy(vec);
		temp.x = vec.x - this.position.x + window.innerWidth / 2;
		temp.y = -vec.y + this.position.y + window.innerHeight / 2;
		return temp;
	}
	onDebug() {
		let ctx = CanvasCreator.context;
		if (ctx != null) {
			let screenSpace = this.toScreenSpace(this.position);
			ctx.strokeStyle = 'LightBlue';
			ctx.strokeRect(
				screenSpace.x - this.boundBoxSize,
				screenSpace.y - this.boundBoxSize,
				this.boundBoxSize * 2,
				this.boundBoxSize * 2
			);
		}
	}
	toWorldSpace(vec: Vector2): Vector2 {
		//TODO: this
		return Vector2.copy(vec);
	}
}
