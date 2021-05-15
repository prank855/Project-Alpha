export class AssetManager {
	static self: AssetManager;

	static mipMapLevels = 3;
	static canvases: HTMLCanvasElement[][] = [];
	static names: string[] = [];
	static tasks: string[] = [];
	static loadImage(imgSrc: string, imageName: string) {
		if (this.tasks.includes(imageName) || AssetManager.hasImage(imageName)) {
			return;
		}
		var img = new Image();
		img.src = imgSrc;
		this.tasks.push(imageName);
		img.onload = () => {
			var canvases: HTMLCanvasElement[] = [];
			var mipmapLevels =
				1 + Math.floor(Math.log2(Math.max(img.width, img.height)));
			console.log(mipmapLevels);
			for (var i = 1; i < mipmapLevels + 1; i++) {
				var factor = i ** 2;
				var offscreenCanvas = document.createElement('canvas');
				offscreenCanvas.width = img.width / factor;
				offscreenCanvas.height = img.height / factor;
				var ctx = offscreenCanvas.getContext('2d', { alpha: true });
				if (ctx) {
					ctx.drawImage(img, 0, 0, img.width / factor, img.height / factor);
					canvases.push(offscreenCanvas);
				}
			}
			this.canvases.push(canvases);
			this.names.push(imageName);
			console.log(
				`Added ${imageName} to Asset Manager, with ${mipmapLevels} levels of MipMap`
			);
			this.tasks.splice(this.tasks.indexOf(imageName), 1);
		};
	}
	static hasImage(imageName: string): boolean {
		for (var i = 0; i < this.names.length; i++) {
			if (this.names[i] == imageName) {
				return true;
			}
		}
		return false;
	}
	static getImage(imageName: string): HTMLCanvasElement[] {
		for (var i = 0; i < this.names.length; i++) {
			if (this.names[i].toLowerCase() == imageName.toLowerCase()) {
				return this.canvases[i];
			}
		}
		throw `Image of name ${imageName} does not exist. Either import it or request a different image`;
	}
}
