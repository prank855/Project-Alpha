import { GameComponent } from '../shared/GameComponent';
import { GameObjectManager } from '../shared/GameObjectManager';
import { Transform } from '../shared/Transform';
import { Vector2 } from '../shared/Vector2';
import { Camera } from './Camera';
import { CanvasCreator } from './CanvasCreator';
import { SpriteLayer } from './SpriteLayer';

export class SpriteRenderer extends GameComponent {
	// TODO: implement sprite manager / asset loading
	// TODO: cache images for performance
	static drawCount: number = 0;
	origin: Vector2 = new Vector2(0, 0);
	width: number = 20;
	height: number = 20;
	camera: Camera | null = null;
	image: HTMLImageElement | null;
	layer: SpriteLayer = SpriteLayer.FOREGROUND;
	color: string = `rgb(${128 + Math.random() * 127},${128 +
		Math.random() * 127},${128 + Math.random() * 127})`;
	constructor(image?: HTMLImageElement) {
		super();
		this.image = image || null;
	}

	start() {
		this.camera = GameObjectManager.self
			?.findGameObject('Camera')
			?.getComponent('Camera') as Camera;
	}

	update() {
		if (this.camera == null) {
			this.camera = GameObjectManager.self
				?.findGameObject('Camera')
				?.getComponent('Camera') as Camera;
		}
	}

	render() {
		let ctx = CanvasCreator.context;
		let transform: Transform = this.parent?.getComponent(
			'Transform'
		) as Transform;
		if (ctx != null) {
			ctx.fillStyle = 'White';
		}

		//TODO: Check if the sprite will even be seen on screen
		/*
		if (
			transform.position.x + this.width - camPos.x > 0 &&
			transform.position.x < CanvasCreator.canvas.width - camPos.x &&
			transform.position.y + this.height - camPos.y > 0 &&
			transform.position.y < CanvasCreator.canvas.height - camPos.y
		)
		*/
		SpriteRenderer.drawCount++;
		let screenSpace: Vector2 = Vector2.zero();
		if (this.camera != null) {
			screenSpace = this.camera?.toScreenSpace(transform.position);
			if (this.image != null) {
				ctx?.drawImage(
					this.image,
					screenSpace?.x - this.width * this.origin.x * this.camera.zoom,
					screenSpace?.y - this.height * this.origin.y * this.camera.zoom,
					this.width * this.camera.zoom,
					this.height * this.camera.zoom
				);
			} else {
				ctx!.fillStyle = this.color;
				ctx?.fillRect(
					screenSpace?.x,
					screenSpace?.y,
					this.width * this.camera.zoom,
					this.height * this.camera.zoom
				);
			}
		}
	}

	onDebug() {
		let ctx = CanvasCreator.context;
		let transform: Transform = this.parent?.getComponent(
			'Transform'
		) as Transform;
		let screenSpace = Vector2.zero();
		if (this.camera != null)
			screenSpace = this.camera?.toScreenSpace(transform.position);
		if (ctx != null && transform != null) {
			ctx.strokeStyle = 'Red';
			let transform: Transform = this.parent?.getComponent(
				'Transform'
			) as Transform;
			if (this.camera != null) {
				ctx.strokeRect(
					screenSpace.x - (this.width / 2) * this.camera.zoom,
					screenSpace.y - (this.height / 2) * this.camera.zoom,
					this.width * this.camera.zoom,
					this.height * this.camera.zoom
				);
			}
			let imageName = this.image?.src || 'None';
			ctx.fillText(
				`SpriteRenderer: ${imageName.substr(imageName.indexOf('/', 7) + 1)}`,
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
