import { Vector2 } from './../shared/Vector2';
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
		window.addEventListener('mousemove', e => {
			//console.log(e);
			this.mousePos.x = e.clientX;
			this.mousePos.y = e.clientY;
		});
		window.addEventListener('mousedown', () => {
			this.mouseDown = true;
		});
		window.addEventListener('mouseup', () => {
			this.mouseDown = false;
		});
		window.addEventListener('touchstart', () => {
			this.mouseDown = true;
		});
		window.addEventListener('touchend', () => {
			this.mouseDown = false;
		});
		document.addEventListener('visibilitychange', e => {
			if (document.visibilityState === 'hidden') {
				this.mouseDown = false;
				this.keys = [];
			}
		});
	}

	static mousePos: Vector2 = Vector2.zero();
	static mouseDown: boolean = false;

	private static keys: string[] = [];

	private static binds: [string, InputAction][] = [
		['w', InputAction.MOVEMENT_UP],
		['a', InputAction.MOVEMENT_LEFT],
		['s', InputAction.MOVEMENT_DOWN],
		['d', InputAction.MOVEMENT_RIGHT],
		['ArrowUp', InputAction.ZOOM_IN],
		['ArrowDown', InputAction.ZOOM_OUT]
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
