import { GameObject } from './GameObject';
import { InputAction } from './InputAction';

export class GameComponent {
	parent: GameObject | null = null;
	debug: boolean = false;
	constructor() {}
	init() {}
	update() {}
	input(_inputs: InputAction[]) {}
	render() {}
	onDebug() {}
}
