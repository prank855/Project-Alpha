import { AssetManager } from './AssetManager';
import { CanvasCreator } from './CanvasCreator';
import { SpriteRenderer } from './SpriteRenderer';
import { Input } from './Input';
import { FrameRate } from './FrameRate';
import { Time } from '../shared/Time';
import { Game } from '../shared/Game';
import { Scene } from '../shared/Scene';
export class Client {
	game: Game;
	lastTime: number = Time.getCurrTime();
	//TODO: use requestAnimFrame to dynamically grab refresh rate
	blackFrameInsertion: boolean = false;
	private debug: boolean = true;
	performanceWindow: boolean = true;
	backgroundColor: string = 'Black';
	private ctx: CanvasRenderingContext2D | null;
	constructor(game: Game) {
		this.game = game;
		CanvasCreator.initializeCanvas();
		if (
			this.game.frameRate < 30 &&
			this.game.frameRate > Object.keys(FrameRate).length / 2
		) {
			this.game.frameRate = 30;
		}
		if (CanvasCreator.context == null) {
			throw 'canvas context is null';
		}
		this.ctx = CanvasCreator.context;
		console.log('Client Created');
		if (
			this.blackFrameInsertion &&
			this.game.frameRate != FrameRate.SMOOTH_FRAMERATE
		) {
			console.warn(
				'You must set frameRateLimit to SMOOTH_FRAMERATE to enable BFI'
			);
		}
	}

	start() {
		Input.initInputEvents();
		var ctx = CanvasCreator.context;

		if (ctx) {
			ctx.fillStyle = this.backgroundColor;
			ctx.fillRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);
			ctx.fillStyle = 'White';
			ctx.font = '75px Consolas';
			var text = `Loading Assets ${(
				((AssetManager.assetCount - AssetManager.tasks.length) /
					AssetManager.assetCount) *
				100
			).toFixed(1)}%`;
			var measureText = ctx.measureText(text);
			ctx.fillText(
				text,
				innerWidth / 2 - measureText.width / 2,
				innerHeight / 2 -
					(measureText.actualBoundingBoxAscent +
						measureText.actualBoundingBoxDescent) /
						2
			);
		}
		if (AssetManager.tasks.length != 0) {
			setTimeout(this.start.bind(this), 1000 / 30);
			return;
		}

		console.log('Assets Loaded');

		this.lastTime = Time.getCurrTime();
		this.game.setup();
		console.warn(`Game Started: ${this.game.gameName}`);
		this.game.start();

		var self = this;

		// dynamically sets framerate to refresh rate
		if (this.game.frameRate == FrameRate.DYNAMIC_FRAMERATE) {
			this.game.frameRate = 60;
			var amount = 20;
			var t: any[] = [];
			function animate(now: any) {
				t.unshift(now);
				if (t.length > 10) {
					var t0 = t.pop();
					var fps = Math.ceil((1000 * 10) / (now - t0));
					amount--;
					if (amount == 0) {
						if (fps < 60) {
							fps = 60;
						}
						self.game.frameRate = fps;
						console.log(`Dynamically set framerate to ${fps}`);
					}
				}
				if (amount != 0) window.requestAnimationFrame(animate);
			}
			window.requestAnimationFrame(animate);
		}
		this.loop();
	}

	private setIntervalError: number = 2;
	loop() {
		let currTime = Time.getCurrTime();
		let self = this;
		let tickDelta = 1 / this.game.frameRate;
		if (this.game.frameRate > 5) {
			if (currTime - this.lastTime < tickDelta) {
				if (
					currTime - this.lastTime + this.setIntervalError / 1000 <
					tickDelta
				) {
					setTimeout(
						self.loop.bind(this),
						1000 / this.game.frameRate -
							((currTime - this.lastTime) * 1000 + this.setIntervalError)
					);
				} else {
					setImmediate(self.loop.bind(this));
				}
				return;
			} else {
				//console.log(currTime - this.lastTime);
			}
		}

		Time.deltaTime = currTime - this.lastTime;
		Time.elapsedTime += Time.deltaTime;
		this.lastTime = currTime;

		//Clear screen for rendering
		this.ctx!.fillStyle = this.backgroundColor;
		this.ctx!.fillRect(0, 0, this.ctx!.canvas.width, this.ctx!.canvas.height);

		this.game.frame++;
		this.game.update();

		if (this.debug || this.performanceWindow) {
			this.ctx!.fillStyle = 'rgba(0,0,0,0.5)';
			this.ctx!.fillRect(0, 0, 265, 150);
			this.ctx!.fillStyle = 'white';
			this.ctx!.font = '15px Consolas';
			this.ctx!.fillText('Client Debug', 10, 15);
			this.ctx!.fillText(
				'Framerate: ' + (1 / Time.deltaTime).toFixed(1),
				10,
				30
			);
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
			this.ctx!.fillText('Frame: ' + this.game.frame, 10, 75);
			this.ctx!.fillText(
				'Objects: ' + this.game.currentScene.getGameObjectsLength(),
				10,
				90
			);
			this.ctx!.fillText(
				'Sprite Draw Count: ' + SpriteRenderer.drawCount,
				10,
				105
			);
			this.ctx!.fillText('Pool Size: ' + Scene.getPoolSize(), 10, 105 + 15);
			this.ctx!.fillText(
				'Current Scene: ' + this.game.currentScene.sceneName,
				10,
				105 + 30
			);
		}
		if (this.game.frameRate == FrameRate.SMOOTH_FRAMERATE) {
			if (this.blackFrameInsertion) {
				requestAnimationFrame(() => {
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
