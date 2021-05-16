import { Time } from './../shared/Time';
import { GameComponent } from './../shared/GameComponent';
export class DynamicMenuMovement extends GameComponent {
	private dir = 0;
	rotateSpeed = (2 * Math.PI) / 4;
	distance = 5;
	constructor() {
		super('DynamicMenuMovement');
	}

	update() {
		if (this.parent) {
			this.parent.transform.position.x = Math.cos(this.dir) * this.distance;
			this.parent.transform.position.y = Math.sin(this.dir) * this.distance;
			this.dir += this.rotateSpeed * Time.deltaTime;
		}
	}
}
