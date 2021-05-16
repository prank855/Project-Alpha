import { Input } from './Input';
import { GameComponent } from '../shared/GameComponent';

export class CursorManager extends GameComponent {
	constructor() {
		super('CursorManager');
	}

	update() {
		if (this.parent) {
			this.parent.transform.position = Input.mousePos;
		}
	}
}
