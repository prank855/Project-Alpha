import { GameObject } from './GameObject';
import { InputAction } from './InputAction';

export class GameComponent {
	parent: GameObject | null = null;
	constructor() {}
	init() {}
	update() {}
	input(_inputs: InputAction[]) {}
	render() {}
	debug() {}
}
