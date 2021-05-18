export class CanvasCreator {
	static canvas: HTMLCanvasElement;
	static context: CanvasRenderingContext2D | null;
	//TODO: refactor into something else
	//TODO: handle a max aspect ratio or a set aspect ratio aka (16:9, 21:9)
	static initializeCanvas() {
		let canvas = document.createElement('canvas');
		canvas.id = 'canvas';
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		window.addEventListener('resize', () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			//console.log(`Window resized to ${canvas.width}x${canvas.height}`);
		});
		document.body.appendChild(canvas);
		document.getElementById(canvas.id)?.addEventListener('contextmenu', e => {
			e.preventDefault();
		});
		document.body.style.overflow = 'hidden';
		document.body.style.margin = '0';
		document.body.style.cursor = 'none';
		this.canvas = canvas;
		this.context = canvas.getContext('2d', { alpha: false });
	}
}
