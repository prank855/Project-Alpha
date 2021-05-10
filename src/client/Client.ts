import { GameObjectManager } from '../shared/GameObjectManager';
import { Time } from '../client/Time';
import { CanvasCreator } from './CanvasCreator';
import { GameObject } from '../shared/GameObject';
import { Transform } from '../shared/Transform';
import { SpriteRenderer } from './SpriteRenderer';
import { MovementScript } from '../shared/MovementScript';
import { Input } from './Input';
export class Client {
	objectManager: GameObjectManager = new GameObjectManager();
	lastTime: number = Time.getCurrTime();
	frame: number = 0;
	gameName: string = 'Unnamed Game';
	private debug: boolean = true;
	private ctx: CanvasRenderingContext2D | null;
	constructor(gameName: string) {
		this.gameName = gameName || 'Unnamed Game';
		CanvasCreator.initializeCanvas();
		if (CanvasCreator.context == null) {
			throw 'canvas context is null';
		}
		this.ctx = CanvasCreator.context;
		console.log('Client Created');
	}
	start() {
		console.log('Client Started');
		Input.initInputEvents();
		var temp = new GameObject();
		temp.addComponent(new Transform());
		temp.addComponent(new SpriteRenderer());
		temp.addComponent(new MovementScript());
		this.objectManager.addGameObject(temp);
		this.loop();
	}
	loop() {
		this.frame++;
		var currTime = Time.getCurrTime();
		Time.deltaTime = currTime - this.lastTime;
		Time.elapsedTime += Time.deltaTime;
		this.lastTime = currTime;
		this.ctx!.fillStyle = 'cornflowerblue';
		this.ctx!.fillRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);

		this.objectManager.update();
		this.objectManager.render();

		if (this.frame % (165 * 5) == 0) {
			console.log('FPS: ', (1 / Time.deltaTime).toFixed(2));
		}
		if (this.debug) {
			this.ctx!.fillStyle = 'rgba(0,0,0,0.5)';
			this.ctx!.fillRect(0, 0, 265, 75 + 15);
			this.ctx!.fillStyle = 'white';
			this.ctx!.font = '15px Consolas';
			this.ctx!.fillText(this.gameName, 10, 15);
			this.ctx!.fillText('Framerate: ' + Math.ceil(1 / Time.deltaTime), 10, 30);
			this.ctx!.fillText(
				'Frametime: ' + (Time.deltaTime * 1000).toFixed(2) + 'ms',
				10,
				45
			);
			this.ctx!.fillText(
				'Elapsed: ' + Time.elapsedTime.toFixed(2) + ' seconds',
				10,
				60
			);
			this.ctx!.fillText('Frame: ' + this.frame, 10, 75);
		}

		requestAnimationFrame(this.loop.bind(this));
	}
}
