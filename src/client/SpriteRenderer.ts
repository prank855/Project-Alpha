import { AssetManager } from './AssetManager';
import { GameComponent } from '../shared/GameComponent';
import { GameObjectManager } from '../shared/GameObjectManager';
import { Transform } from '../shared/Transform';
import { Vector2 } from '../shared/Vector2';
import { Camera } from './Camera';
import { CanvasCreator } from './CanvasCreator';
import { SpriteLayer } from './SpriteLayer';

export class SpriteRenderer extends GameComponent {
	// TODO: implement sprite manager / asset loading
	static drawCount: number = 0;
	origin: Vector2 = new Vector2(0, 0);
	width: number = 20;
	height: number = 20;
	camera: Camera | null = null;
	//TODO: handle sprite layers
	layer: SpriteLayer = SpriteLayer.FOREGROUND;
	color: string = `rgb(${128 + Math.random() * 127},${128 +
		Math.random() * 127},${128 + Math.random() * 127})`;
	transform: Transform | null = null;
	sprite: HTMLCanvasElement | null = null;
	spriteName: string = 'Unknown';
	constructor() {
		super('SpriteRenderer');
	}

	setImage(spriteName: string, scale: number, width?: number, height?: number) {
		var s = AssetManager.getSprite(spriteName);
		if (s == null) {
			console.log(`Could not set Image to ${spriteName}`);
			return;
		}
		this.sprite = s;
		this.spriteName = spriteName;
		this.width = width || s.width * scale || this.width;
		this.height = height || s.height * scale || this.height;
	}

	start() {
		this.camera = GameObjectManager.self
			?.findGameObject('Camera')
			?.getComponent('Camera') as Camera;
		this.transform = this.parent?.getComponent('Transform') as Transform;
	}

	render() {
		//TODO: if sprite draw is bigger than canvas only draw from that specific region of image
		let ctx = CanvasCreator.context;
		if (this.camera != null && this.transform != null) {
			let screenSpace = this.camera.toScreenSpace(this.transform.position);
			if (
				screenSpace.x - this.width * this.origin.x * Camera.currZoom <
					innerWidth &&
				screenSpace.x + this.width * this.origin.x * Camera.currZoom > 0 &&
				screenSpace.y - this.height * this.origin.y * Camera.currZoom <
					window.innerHeight &&
				screenSpace.y + this.height * this.origin.y * Camera.currZoom > 0
			) {
				SpriteRenderer.drawCount++;
				if (this.sprite != null) {
					ctx?.drawImage(
						this.sprite,
						screenSpace.x - this.width * this.origin.x * Camera.currZoom,
						screenSpace.y - this.height * this.origin.y * Camera.currZoom,
						this.width * Camera.currZoom,
						this.height * Camera.currZoom
					);
				} else {
					ctx!.fillStyle = this.color;
					ctx?.fillRect(
						screenSpace.x - this.width * this.origin.x * Camera.currZoom,
						screenSpace.y - this.height * this.origin.y * Camera.currZoom,
						this.width * Camera.currZoom,
						this.height * Camera.currZoom
					);
				}
			}
		}
	}

	onDebug() {
		let ctx = CanvasCreator.context;
		let transform: Transform = this.parent?.getComponent(
			'Transform'
		) as Transform;
		let screenSpace: Vector2 = Vector2.zero();
		if (this.camera != null)
			screenSpace = this.camera?.toScreenSpace(transform.position);
		if (ctx != null && transform != null && screenSpace != null) {
			ctx.strokeStyle = 'Red';
			ctx.lineWidth = 1;
			let transform: Transform = this.parent?.getComponent(
				'Transform'
			) as Transform;
			if (this.camera != null) {
				ctx.strokeRect(
					screenSpace.x - (this.width / 2) * Camera.currZoom,
					screenSpace.y - (this.height / 2) * Camera.currZoom,
					this.width * Camera.currZoom,
					this.height * Camera.currZoom
				);
			}
			ctx.fillStyle = 'White';
			ctx.fillText(
				`SpriteRenderer: ${this.spriteName.substr(
					this.spriteName.indexOf('/', 7) + 1
				)}`,
				screenSpace.x - this.width * this.origin.x + this.width / 2,
				screenSpace.y - this.height * this.origin.y + this.height + 15
			);
			ctx.fillText(
				transform.position.toString(),
				screenSpace.x - this.width * this.origin.x + this.width / 2,
				screenSpace.y - this.height * this.origin.y + this.height + 30
			);
			ctx.fillText(
				`Width: ${this.width}, Height: ${this.height}`,
				screenSpace.x - this.width * this.origin.x + this.width / 2,
				screenSpace.y - this.height * this.origin.y + this.height + 45
			);
		}
	}
}
