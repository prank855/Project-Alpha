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
	speed: number = 150;
	direction: Vector2 = Vector2.zero();
	velocity: Vector2 = Vector2.zero();
	friction: number = 0.01;
	constructor() {
		super();
	}
	init() {
		this.transform = this.parent?.getComponent('Transform') as Transform;
	}
	update() {}
	input(_inputs: InputAction[]) {
		this.direction = Vector2.zero();
		if (this.transform != null) {
			this.velocity.multiply(
				Math.E ** (Time.deltaTime * Math.log(this.friction))
			);
			var flag = false;
			if (_inputs.includes(InputAction.MOVEMENT_UP)) {
				this.direction.y += 1;
				flag = true;
			}
			if (_inputs.includes(InputAction.MOVEMENT_LEFT)) {
				this.direction.x += -1;
				flag = true;
			}
			if (_inputs.includes(InputAction.MOVEMENT_DOWN)) {
				this.direction.y -= 1;
				flag = true;
			}
			if (_inputs.includes(InputAction.MOVEMENT_RIGHT)) {
				this.direction.x += 1;
				flag = true;
			}
			if (flag) {
				var tempDir = Vector2.copy(this.direction).normalize();
				if (this.direction.x != 0) {
					this.velocity.x = tempDir.x * this.speed;
				}
				if (this.direction.y != 0) {
					this.velocity.y = tempDir.y * this.speed;
				}
			}
			if (this.velocity.getMagnitude() > this.speed) {
				this.velocity.normalize().multiply(this.speed);
			}

			this.transform.position.add(
				Vector2.copy(this.velocity).multiply(Time.deltaTime)
			);
		}
	}
	onDebug() {
		let camera = GameObjectManager.self
			?.findGameObject('Camera')
			?.getComponent('Camera') as Camera;
		if (this.transform != null) {
			let ctx: CanvasRenderingContext2D | null = CanvasCreator.context;
			if (ctx != null) {
				let screenSpace = camera.toScreenSpace(this.transform?.position);
				let normalizeDir = Vector2.copy(this.velocity).multiply(
					camera.getZoom()
				);
				ctx.strokeStyle = 'Black';
				ctx?.beginPath();
				ctx?.moveTo(screenSpace.x, screenSpace.y);
				ctx?.lineTo(
					screenSpace.x + normalizeDir.x,
					screenSpace.y - normalizeDir.y
				);
				ctx.stroke();
				if (this.velocity.getMagnitude() > this.speed * 0.2)
					ctx.fillText(
						this.velocity.getMagnitude().toFixed(2),
						screenSpace.x + normalizeDir.x,
						screenSpace.y - normalizeDir.y
					);
			}
		}
	}
}
