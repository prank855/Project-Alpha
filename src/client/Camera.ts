import { GameComponent } from '../shared/GameComponent';
import { Transform } from '../shared/Transform';
import { Vector2 } from '../shared/Vector2';
import { Time } from './Time';

export class Camera extends GameComponent {
	position: Vector2 = Vector2.zero();
	target: Transform | null = null;
	//TODO: zoom
	constructor() {
		super();
	}
	start() {
		if (this.target != null)
			this.position = Vector2.copy(this.target?.position);
	}
	update() {
		if (this.target != null) {
			this.position.x +=
				(this.target.position.x - this.position.x) * Time.deltaTime;
			this.position.y +=
				(-this.target.position.y - this.position.y) * Time.deltaTime;
		}
	}
	toScreenSpace(vec: Vector2): Vector2 {
		return Vector2.copy(vec)
			.multiply(new Vector2(1, -1))
			.add(
				Vector2.copy(this.position)
					.multiply(-1)
					.add(new Vector2(window.innerWidth / 2, window.innerHeight / 2))
			);
	}
	toWorldSpace(vec: Vector2): Vector2 {
		//TODO: this
		return Vector2.copy(vec);
	}
}
