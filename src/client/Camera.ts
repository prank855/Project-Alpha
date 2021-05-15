import { Input } from './Input';
import { InputAction } from '../shared/InputAction';
import { Time } from '../shared/Time';
import { Util } from '../shared/Util';
import { Vector2 } from '../shared/Vector2';
import { CanvasCreator } from './CanvasCreator';
import { GameObject } from '../shared/GameObject';

export class Camera {
	static currZoom: number = 1;
	static position: Vector2 = Vector2.zero();
	target: GameObject | null = null;
	static boundBoxSize: number = 240;
	static speed: number = 1;
	private static zoom: number = 1;
	static size: number = 500;
	static zoomSpeed: number = 1.5;
	static zoomMin: number = 1 / 8;
	static zoomMax: number = 1.2;
	//TODO: rotation

	input(_inputs: InputAction[]) {
		if (_inputs.includes(InputAction.ZOOM_IN)) {
			Camera.zoom *= Math.E ** (Time.deltaTime * Math.log(Camera.zoomSpeed));
		}
		if (_inputs.includes(InputAction.ZOOM_OUT)) {
			Camera.zoom /= Math.E ** (Time.deltaTime * Math.log(Camera.zoomSpeed));
		}
		Camera.zoom = Util.bound(Camera.zoom, Camera.zoomMin, Camera.zoomMax);
	}
	update() {
		Camera.currZoom = Camera.getZoom();
		this.input(Input.GetInputs());
		if (this.target != null) {
			//lerp camera to target
			var xv =
				(this.target.transform.position.x - Camera.position.x) *
				Time.deltaTime *
				Camera.speed *
				(1 / Camera.zoom);
			if (xv > 0) {
				if (Camera.position.x + xv > this.target.transform.position.x) {
					Camera.position.x = this.target.transform.position.x;
				} else {
					Camera.position.x += xv;
				}
			} else {
				if (Camera.position.x + xv < this.target.transform.position.x) {
					Camera.position.x = this.target.transform.position.x;
				} else {
					Camera.position.x += xv;
				}
			}
			var yv =
				(this.target.transform.position.y - Camera.position.y) *
				Time.deltaTime *
				Camera.speed *
				(1 / Camera.zoom);
			if (yv > 0) {
				if (Camera.position.y + yv > this.target.transform.position.y) {
					Camera.position.y = this.target.transform.position.y;
				} else {
					Camera.position.y += yv;
				}
			} else {
				if (Camera.position.y + yv < this.target.transform.position.y) {
					Camera.position.y = this.target.transform.position.y;
				} else {
					Camera.position.y += yv;
				}
			}

			//check bounds
			if (
				this.target.transform.position.x - Camera.position.x >
				Camera.boundBoxSize
			) {
				Camera.position.x =
					this.target.transform.position.x - Camera.boundBoxSize;
			}
			if (
				this.target.transform.position.x - Camera.position.x <
				-Camera.boundBoxSize
			) {
				Camera.position.x =
					this.target.transform.position.x + Camera.boundBoxSize;
			}
			if (
				this.target.transform.position.y - Camera.position.y >
				Camera.boundBoxSize
			) {
				Camera.position.y =
					this.target.transform.position.y - Camera.boundBoxSize;
			}
			if (
				this.target.transform.position.y - Camera.position.y <
				-Camera.boundBoxSize
			) {
				Camera.position.y =
					this.target.transform.position.y + Camera.boundBoxSize;
			}
		}
	}

	static getZoom(): number {
		let min = 0;
		if (window.innerHeight < window.innerWidth) {
			min = innerHeight;
		} else {
			min = innerWidth;
		}
		return this.zoom * (min / this.size);
	}

	static toScreenSpace(vec: Vector2): Vector2 {
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
			let screenSpace = Camera.toScreenSpace(Camera.position);
			ctx.strokeStyle = 'LightBlue';
			ctx.strokeRect(
				screenSpace.x - Camera.boundBoxSize * Camera.currZoom,
				screenSpace.y - Camera.boundBoxSize * Camera.currZoom,
				Camera.boundBoxSize * 2 * Camera.currZoom,
				Camera.boundBoxSize * 2 * Camera.currZoom
			);
		}
	}
	static toWorldSpace(vec: Vector2): Vector2 {
		//TODO: this
		//https://www.wolframalpha.com/input/?i=x%3D%28a*z+%29+-+%28b*z%29+%2B+%28w+%2F+2%29+solve+b
		return Vector2.copy(vec);
	}
}
