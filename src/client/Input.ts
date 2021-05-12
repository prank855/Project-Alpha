import { InputAction } from '../shared/InputAction';

export class Input {
	static initInputEvents() {
		window.addEventListener('keydown', e => {
			for (let i = 0; i < this.keys.length; i++) {
				if (this.keys[i] == e.key) {
					return;
				}
			}
			this.keys.push(e.key);
		});
		window.addEventListener('keyup', e => {
			for (let i = 0; i < this.keys.length; i++) {
				if (this.keys[i] == e.key) {
					this.keys.splice(i, 1);
					return;
				}
			}
		});
		//TODO: Mouse Events
		//TODO: handle unfocus event
	}

	private static keys: string[] = [];

	private static binds: [string, InputAction][] = [
		['w', InputAction.MOVEMENT_UP],
		['a', InputAction.MOVEMENT_LEFT],
		['s', InputAction.MOVEMENT_DOWN],
		['d', InputAction.MOVEMENT_RIGHT]
	];
	static GetInput(inputAction: InputAction): boolean {
		let char: string = '';
		for (let bind of this.binds) {
			if (bind[1] == inputAction) {
				char = bind[0];
				break;
			}
		}
		if (char == '') {
			return false;
		}
		return this.keys.includes(char);
	}

	static GetInputs(): InputAction[] {
		let inputs: InputAction[] = [];
		for (let bind of this.binds) {
			for (let key of this.keys) {
				if (bind[0] == key) {
					inputs.push(bind[1]);
				}
			}
		}
		return inputs;
	}
}
