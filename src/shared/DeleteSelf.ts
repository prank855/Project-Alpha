import { Time } from './Time';
import { GameComponent } from './GameComponent';

export class DeleteSelf extends GameComponent {
	timeToLive: number = 5;
	timeAlive: number = 0;
	constructor() {
		super('DeleteSelf');
	}
	update() {
		this.timeAlive += Time.deltaTime;
		if (this.timeAlive >= this.timeToLive) {
			if (this.parent) {
				this.parent.delete = true;
			}
		}
	}
}
