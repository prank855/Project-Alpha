import { GameObjectManager } from '../shared/GameObjectManager';
import { Time } from '../client/Time';
import { CanvasCreator } from './CanvasCreator';
import { GameObject } from '../shared/GameObject';
import { Transform } from '../shared/Transform';
import { SpriteRenderer } from './SpriteRenderer';
import { MovementScript } from '../shared/MovementScript';
import { Input } from './Input';
import { FrameRate } from './FrameRate';
import { Camera } from './Camera';
export class Client {
	objectManager: GameObjectManager = new GameObjectManager();
	lastTime: number = Time.getCurrTime();
	frame: number = 0;
	gameName: string = 'Unnamed Game';
	frameRateLimit: number | FrameRate = FrameRate.SMOOTH_FRAMERATE;
	blackFrameInsertion: boolean = false;
	private debug: boolean = true;
	private ctx: CanvasRenderingContext2D | null;
	constructor(gameName?: string) {
		this.gameName = gameName || 'Unnamed Game';
		CanvasCreator.initializeCanvas();
		if (CanvasCreator.context == null) {
			throw 'canvas context is null';
		}
		this.ctx = CanvasCreator.context;
		console.log('Client Created');
		if (
			this.blackFrameInsertion &&
			this.frameRateLimit != FrameRate.SMOOTH_FRAMERATE
		) {
			console.warn(
				'You must set frameRateLimit to SMOOTH_FRAMERATE to enable BFI'
			);
		}
	}
	start() {
		console.log('Client Started');
		Input.initInputEvents();
		{
			let temp = new GameObject('Middle of World');
			temp.addComponent(new Transform());
			let sR = new SpriteRenderer();
			sR.width = 10;
			sR.height = 10;
			temp.addComponent(sR);
			this.objectManager.addGameObject(temp);
		}
		{
			let temp = new GameObject('Player');
			temp.addComponent(new Transform());
			let img = new Image();
			img.src = "trollface.png";
			let sR = new SpriteRenderer(img);
			sR.width = 50;
			sR.height = 50;
			temp.addComponent(sR);
			temp.addComponent(new MovementScript());
			this.objectManager.addGameObject(temp);
		}
		{
			let temp = new GameObject('Camera');
			let cam = new Camera();
			cam.target = GameObjectManager.self
				?.findGameObject('Player')
				?.getComponent('Transform') as Transform;
			temp.addComponent(cam);
			this.objectManager.addGameObject(temp);
		}

		this.loop();
	}
	loop() {
		let self = this;
		this.frame++;
		let currTime = Time.getCurrTime();
		Time.deltaTime = currTime - this.lastTime;
		Time.elapsedTime += Time.deltaTime;
		this.lastTime = currTime;
		this.ctx!.fillStyle = 'cornflowerblue';
		this.ctx!.fillRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);

		this.objectManager.input();
		this.objectManager.update();
		SpriteRenderer.drawCount = 0;
		this.objectManager.render();
		if (this.debug) this.objectManager.debug();
		//TODO: call based on time interval not frame interval (Currently assumes 165hz every 5 seconds)
		if (this.frame % (165 * 5) == 0) {
			//TODO: return avg fps over accrued frametimes like server implementation
			console.log('FPS: ', (1 / Time.deltaTime).toFixed(2));
		}
		if (this.debug) {
			this.ctx!.fillStyle = 'rgba(0,0,0,0.5)';
			this.ctx!.fillRect(0, 0, 265, 105 + 15);
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
			this.ctx!.fillText(
				'Objects: ' + this.objectManager.getObjectListSize(),
				10,
				90
			);
			this.ctx!.fillText('Draw Count: ' + SpriteRenderer.drawCount, 10, 105);
		}
		if (this.frameRateLimit == FrameRate.SMOOTH_FRAMERATE) {
			if (this.blackFrameInsertion) {
				requestAnimationFrame(function() {
					self.ctx!.fillStyle = 'black';
					self.ctx!.fillRect(0, 0, window.innerWidth, window.innerHeight);
					requestAnimationFrame(self.loop.bind(self));
				});
			} else {
				requestAnimationFrame(this.loop.bind(this));
			}
			return;
		} else if (this.frameRateLimit == FrameRate.UNLIMITED_FRAMERATE) {
			setImmediate(this.loop.bind(this));
			return;
		} else {
			//TODO: smoother frametimes with this like the server implementation
			setTimeout(this.loop.bind(this), 1000 / this.frameRateLimit);
			return;
		}
	}
}
