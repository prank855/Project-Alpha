import { InputAction } from '../shared/InputAction';

export class Input {
	static initInputEvents() {
		window.addEventListener('keydown', e => {
			for (var i = 0; i < this.keys.length; i++) {
				if (this.keys[i] == e.key) {
					return;
				}
			}
			this.keys.push(e.key);
		});
		window.addEventListener('keyup', e => {
			for (var i = 0; i < this.keys.length; i++) {
				if (this.keys[i] == e.key) {
					this.keys.splice(i, 1);
					return;
				}
			}
		});
		//TODO: Mouse Events
	}

	private static keys: string[] = [];

	private static binds: [string, InputAction][] = [
		['w', InputAction.MOVEMENT_UP],
		['a', InputAction.MOVEMENT_LEFT],
		['s', InputAction.MOVEMENT_DOWN],
		['d', InputAction.MOVEMENT_RIGHT]
	];
	static GetInput(inputAction: InputAction): boolean {
		var char: string = '';
		for (var bind of this.binds) {
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
		var inputs: InputAction[] = [];
		for (var bind of this.binds) {
			for (var key of this.keys) {
				if (bind[0] == key) {
					inputs.push(bind[1]);
				}
			}
		}
		return inputs;
	}
}
