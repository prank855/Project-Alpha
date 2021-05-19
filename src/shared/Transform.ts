import { Vector2 } from './Vector2';

export class Transform {
	position: Vector2 = Vector2.zero();
	//TODO: rotation logic
	// rotation: number = 0;
	constructor(position?: Vector2) {
		if (position) this.position = position;
	}
}
