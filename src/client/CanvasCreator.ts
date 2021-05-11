export class CanvasCreator {
	static canvas: HTMLCanvasElement;
	static context: CanvasRenderingContext2D | null;
	static initializeCanvas() {
		var canvas = document.createElement('canvas');
		canvas.id = 'canvas';
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		window.addEventListener('resize', () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			console.log(`Window resized to ${canvas.width}x${canvas.height}`);
		});
		document.body.appendChild(canvas);
		document
			.getElementById(canvas.id)
			?.addEventListener('contextmenu', function(e) {
				e.preventDefault();
			});
		document.body.style.overflow = 'hidden';
		document.body.style.margin = '0';
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
	}
}
