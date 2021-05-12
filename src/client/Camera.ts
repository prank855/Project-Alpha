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
	position: Vector2 = Vector2.zero();
	target: Transform | null = null;
	boundBoxSize: number = 240;
	speed: number = 1 / 4;
	private zoom: number = 1;
	size: number = 1000;
	zoomSpeed: number = 2;
	zoomMin: number = 1 / 1.2;
	zoomMax: number = 1.2;
	//TODO: zoom
	//TODO: rotation
	constructor() {
		super();
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

	getZoom(): number {
		var min = 0;
		if (window.innerHeight < window.innerWidth) {
			min = innerHeight;
		} else {
			min = innerWidth;
		}
		return this.zoom * (min / this.size);
	}

	toScreenSpace(vec: Vector2): Vector2 {
		let temp = Vector2.copy(vec);
		temp.x =
			vec.x * this.getZoom() -
			this.position.x * this.getZoom() +
			window.innerWidth / 2;
		temp.y =
			-vec.y * this.getZoom() +
			this.position.y * this.getZoom() +
			window.innerHeight / 2;
		return temp;
	}
	onDebug() {
		let ctx = CanvasCreator.context;
		if (ctx != null) {
			let screenSpace = this.toScreenSpace(this.position);
			ctx.strokeStyle = 'LightBlue';
			ctx.strokeRect(
				screenSpace.x - this.boundBoxSize * this.getZoom(),
				screenSpace.y - this.boundBoxSize * this.getZoom(),
				this.boundBoxSize * 2 * this.getZoom(),
				this.boundBoxSize * 2 * this.getZoom()
			);
		}
	}
	toWorldSpace(vec: Vector2): Vector2 {
		//TODO: this
		return Vector2.copy(vec);
	}
}
