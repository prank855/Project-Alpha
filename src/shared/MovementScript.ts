import { Time } from '../client/Time';
import { GameComponent } from './GameComponent';
import { Transform } from './Transform';

export class MovementScript extends GameComponent {
	transform: Transform | null = null;
	constructor() {
		super();
	}
	init() {
		this.transform = this.parent?.getComponent('Transform') as Transform;
	}
	update() {
		if (this.transform != null) {
			this.transform.position.x += Time.deltaTime * 20;
		}
	}
}
