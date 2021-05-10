export class Input {
	static initInputEvents() {
		window.addEventListener('keydown', e => {
			console.log(e.key);
		});
	}

	static keyDown(key: string): boolean {
		return false;
	}
	static keyUp(key: string): boolean {
		return false;
	}
	static keyHeld(key: string): boolean {
		return false;
	}
	static keyPressed(key: string): boolean {
		return false;
	}
}
