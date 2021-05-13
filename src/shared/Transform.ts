import { GameComponent } from './GameComponent';
import { Vector2 } from './Vector2';

export class Transform extends GameComponent {
	position: Vector2;
	constructor(vec2?: Vector2) {
		super('Transform');
		this.position = vec2 || Vector2.zero();
	}
}
