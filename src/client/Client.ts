import { ClientGameManager } from './ClientGameManager';
import { GameManager } from './../shared/GameManager';
import { AssetManager } from './AssetManager';
import { Time } from '../client/Time';
import { CanvasCreator } from './CanvasCreator';
import { SpriteRenderer } from './SpriteRenderer';
import { Input } from './Input';
import { FrameRate } from './FrameRate';
export class Client {
	game: GameManager = new ClientGameManager();
	lastTime: number = Time.getCurrTime();
	frame: number = 0;
	frameRateLimit: number | FrameRate = FrameRate.SMOOTH_FRAMERATE;
	blackFrameInsertion: boolean = false;
	private debug: boolean = true;
	performanceWindow: boolean = true;
	clientUpdateRate: number = 60;
	backgroundColor: string = 'cornflowerblue';
	private ctx: CanvasRenderingContext2D | null;
	constructor() {
		CanvasCreator.initializeCanvas();
		if (
			this.frameRateLimit < 30 &&
			this.frameRateLimit > Object.keys(FrameRate).length / 2
		) {
			this.frameRateLimit = 30;
		}
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
		Input.initInputEvents();

		AssetManager.addSprite('trollface.png', 'TrollFace');
		AssetManager.addSprite(
			'https://png.pngtree.com/png-clipart/20210418/original/pngtree-golden-shiny-sky-jesus-boosting-day-png-image_6234916.jpg',
			'Jesus'
		);
		if (AssetManager.tasks.length != 0) {
			setTimeout(this.start.bind(this), 1000 / 30);
			return;
		}

		console.log('Client Started');

		this.lastTime = Time.getCurrTime();

		this.game.start();

		this.loop();
	}
	private setIntervalError: number = 2;
	loop() {
		let currTime = Time.getCurrTime();
		let self = this;
		let tickDelta = 1000 / this.frameRateLimit;
		if (this.frameRateLimit > 5) {
			if ((currTime - this.lastTime) * 1000 < tickDelta) {
				if (currTime - this.lastTime + this.setIntervalError < tickDelta) {
					setTimeout(self.loop.bind(this), 1);
				} else {
					setImmediate(self.loop.bind(this));
				}
				return;
			}
		}

		this.frame++;
		Time.deltaTime = currTime - this.lastTime;
		Time.elapsedTime += Time.deltaTime;
		this.lastTime = currTime;
		this.ctx!.fillStyle = this.backgroundColor;
		this.ctx!.fillRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);

		this.game.update();

		if (this.debug) this.game.onDebug();

		if (this.debug || this.performanceWindow) {
			this.ctx!.fillStyle = 'rgba(0,0,0,0.5)';
			this.ctx!.fillRect(0, 0, 265, 105 + 15);
			this.ctx!.fillStyle = 'white';
			this.ctx!.font = '15px Consolas';
			this.ctx!.fillText('Client Debug', 10, 15);
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
				'Objects: ' + this.game.objectManager.getObjectListSize(),
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
		} else {
			setImmediate(this.loop.bind(this));
			return;
		}
	}
}
