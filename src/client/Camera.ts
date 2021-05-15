import { GameComponent } from '../shared/GameComponent';
import { GameObjectManager } from '../shared/GameObjectManager';
import { InputAction } from '../shared/InputAction';
import { Transform } from '../shared/Transform';
import { Util } from '../shared/Util';
import { Vector2 } from '../shared/Vector2';
import { CanvasCreator } from './CanvasCreator';
import { Time } from './Time';

export class Camera extends GameComponent {
	//TODO: use transform component instead of position
	static self: Camera;
	static currZoom: number = 1;
	position: Vector2 = Vector2.zero();
	target: Transform | null = null;
	boundBoxSize: number = 240;
	speed: number = 1;
	private zoom: number = 1;
	size: number = 500;
	zoomSpeed: number = 2;
	zoomMin: number = 1 / 1.4;
	zoomMax: number = 1.2;
	//TODO: rotation
	constructor() {
		super('Camera');
		Camera.self = this;
	}

	start() {
		this.target = GameObjectManager.self
			?.findGameObject('Player')
			?.getComponent('Transform') as Transform;
		if (this.target != null)
			this.position = Vector2.copy(this.target?.position);
	}
	input(_inputs: InputAction[]) {
		if (_inputs.includes(InputAction.ZOOM_IN)) {
			this.zoom *= Math.E ** (Time.deltaTime * Math.log(this.zoomSpeed));
		}
		if (_inputs.includes(InputAction.ZOOM_OUT)) {
			this.zoom /= Math.E ** (Time.deltaTime * Math.log(this.zoomSpeed));
		}
		this.zoom = Util.bound(this.zoom, this.zoomMin, this.zoomMax);
	}
	update() {
		//this.zoom *= Math.E ** (time.deltaTime * Math.log(this.zoomSpeed));
		Camera.currZoom = this.getZoom();
		if (this.target != null) {
			//lerp camera to target
			var xv =
				(this.target.position.x - this.position.x) *
				Time.deltaTime *
				this.speed *
				(1 / this.zoom);
			if (xv > 0) {
				if (this.position.x + xv > this.target.position.x) {
					this.position.x = this.target.position.x;
				} else {
					this.position.x += xv;
				}
			} else {
				if (this.position.x + xv < this.target.position.x) {
					this.position.x = this.target.position.x;
				} else {
					this.position.x += xv;
				}
			}
			var yv =
				(this.target.position.y - this.position.y) *
				Time.deltaTime *
				this.speed *
				(1 / this.zoom);
			if (yv > 0) {
				if (this.position.y + yv > this.target.position.y) {
					this.position.y = this.target.position.y;
				} else {
					this.position.y += yv;
				}
			} else {
				if (this.position.y + yv < this.target.position.y) {
					this.position.y = this.target.position.y;
				} else {
					this.position.y += yv;
				}
			}

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

	getZoom(): number {
		let min = 0;
		if (window.innerHeight < window.innerWidth) {
			min = innerHeight;
		} else {
			min = innerWidth;
		}
		return this.zoom * (min / this.size);
	}

	//TODO: make this static
	toScreenSpace(vec: Vector2): Vector2 {
		return new Vector2(
			vec.x * Camera.currZoom -
				this.position.x * Camera.currZoom +
				window.innerWidth / 2,
			-vec.y * Camera.currZoom +
				this.position.y * Camera.currZoom +
				window.innerHeight / 2
		);
	}
	onDebug() {
		let ctx = CanvasCreator.context;
		if (ctx != null) {
			let screenSpace = this.toScreenSpace(this.position);
			ctx.strokeStyle = 'LightBlue';
			ctx.strokeRect(
				screenSpace.x - this.boundBoxSize * Camera.currZoom,
				screenSpace.y - this.boundBoxSize * Camera.currZoom,
				this.boundBoxSize * 2 * Camera.currZoom,
				this.boundBoxSize * 2 * Camera.currZoom
			);
		}
	}
	toWorldSpace(vec: Vector2): Vector2 {
		//TODO: this
		//https://www.wolframalpha.com/input/?i=x%3D%28a*z+%29+-+%28b*z%29+%2B+%28w+%2F+2%29+solve+b
		return Vector2.copy(vec);
	}
}
