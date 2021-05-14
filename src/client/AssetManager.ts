export class AssetManager {
	static self: AssetManager;

	static canvases: HTMLCanvasElement[] = [];
	static names: string[] = [];
	static tasks: string[] = [];
	static addSprite(imgSrc: string, spriteName: string) {
		if (this.tasks.includes(spriteName) || AssetManager.hasSprite(spriteName)) {
			return;
		}
		var img = new Image();
		img.src = imgSrc;
		this.tasks.push(spriteName);
		img.onload = () => {
			var offscreenCanvas = document.createElement('canvas');
			offscreenCanvas.width = img.width;
			offscreenCanvas.height = img.height;
			var ctx = offscreenCanvas.getContext('2d', { alpha: true });
			if (ctx != null) {
				ctx.drawImage(img, 0, 0);
				this.canvases.push(offscreenCanvas);
				this.names.push(spriteName);
				console.log(`Added ${spriteName} to Asset Manager`);
				this.tasks.splice(this.tasks.indexOf(spriteName), 1);
			} else {
				console.log('Offscreen Canvas Context is null');
			}
		};
	}
	static hasSprite(spriteName: string): boolean {
		for (var i = 0; i < this.names.length; i++) {
			if (this.names[i] == spriteName) {
				return true;
			}
		}
		return false;
	}
	static getSprite(spriteName: string): HTMLCanvasElement | null {
		for (var i = 0; i < this.names.length; i++) {
			if (this.names[i].toLowerCase() == spriteName.toLowerCase()) {
				return this.canvases[i];
			}
		}
		return null;
	}
}
