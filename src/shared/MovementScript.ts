import { Camera } from '../client/Camera';
import { CanvasCreator } from '../client/CanvasCreator';
import { Time } from '../client/Time';
import { GameComponent } from './GameComponent';
import { GameObjectManager } from './GameObjectManager';
import { InputAction } from './InputAction';
import { Transform } from './Transform';
import { Vector2 } from './Vector2';

export class MovementScript extends GameComponent {
	transform: Transform | null = null;
	speed: number = 100;
	direction: Vector2 = Vector2.zero();
	constructor() {
		super();
	}
	init() {
		this.transform = this.parent?.getComponent('Transform') as Transform;
		if (this.transform != null) {
			this.transform.position = Vector2.zero();
		}
	}
	update() {}
	input(_inputs: InputAction[]) {
		this.direction = Vector2.zero();
		if (this.transform != null) {
			if (_inputs.includes(InputAction.MOVEMENT_UP)) {
				this.direction.y += 1;
			}
			if (_inputs.includes(InputAction.MOVEMENT_LEFT)) {
				this.direction.x += -1;
			}
			if (_inputs.includes(InputAction.MOVEMENT_DOWN)) {
				this.direction.y -= 1;
			}
			if (_inputs.includes(InputAction.MOVEMENT_RIGHT)) {
				this.direction.x += 1;
			}
			this.transform.position.add(
				Vector2.copy(this.direction)
					.normalize()
					.multiply(this.speed)
					.multiply(Time.deltaTime)
			);
		}
	}
	debug() {
		let camera = GameObjectManager.self
			?.findGameObject('Camera')
			?.getComponent('Camera') as Camera;
		if (this.transform != null) {
			let ctx: CanvasRenderingContext2D | null = CanvasCreator.context;
			if (ctx != null) {
				let screenSpace = camera.toScreenSpace(this.transform?.position);
				let normalizeDir = Vector2.copy(this.direction).normalize();
				ctx.strokeStyle = 'Black';
				ctx?.beginPath();
				ctx?.moveTo(screenSpace.x, screenSpace.y);
				ctx?.lineTo(
					screenSpace.x + normalizeDir.x * this.speed,
					screenSpace.y - normalizeDir.y * this.speed
				);
				ctx.stroke();
			}
		}
	}
}
