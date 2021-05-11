import { Time } from '../client/Time';
import { GameComponent } from './GameComponent';
import { InputAction } from './InputAction';
import { Transform } from './Transform';
import { Vector2 } from './Vector2';

export class MovementScript extends GameComponent {
	transform: Transform | null = null;
	speed: number = 50;
	constructor() {
		super();
	}
	init() {
		this.transform = this.parent?.getComponent('Transform') as Transform;
		this.transform.position = new Vector2(
			window.innerWidth / 2,
			window.innerHeight / 2
		);
	}
	update() {}
	input(_inputs: InputAction[]) {
		if (this.transform != null) {
			var direction = Vector2.zero();
			if (_inputs.includes(InputAction.MOVEMENT_UP)) {
				direction.y += -1;
			}
			if (_inputs.includes(InputAction.MOVEMENT_LEFT)) {
				direction.x += -1;
			}
			if (_inputs.includes(InputAction.MOVEMENT_DOWN)) {
				direction.y += 1;
			}
			if (_inputs.includes(InputAction.MOVEMENT_RIGHT)) {
				direction.x += 1;
			}
			this.transform.position.add(
				direction
					.normalize()
					.multiply(this.speed)
					.multiply(Time.deltaTime)
			);
		}
	}
}
