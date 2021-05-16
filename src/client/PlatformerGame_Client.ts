import { GuiBox } from './GuiBox';
import { PlatformerCameraController } from './PlatformerCameraController';
import { GuiButton } from './GuiButton';
import { SpriteLayer } from './SpriteLayer';
import { SpriteManager } from './SpriteManager';
import { FrameRate } from './FrameRate';
import { MovementScript } from './../shared/MovementScript';
import { SpriteRenderer } from './SpriteRenderer';
import { Camera } from './Camera';
import { Game } from '../shared/Game';
import { AssetManager } from './AssetManager';
import { Sprite } from './Sprite';
import { Vector2 } from '../shared/Vector2';
import { Scene } from '../shared/Scene';
import { CanvasCreator } from './CanvasCreator';
import { DynamicMenuMovement } from './DynamicMenuMovement';
import { CursorManager } from './CursorManager';

export class PlatformerGame_Client extends Game {
	frameRate = FrameRate.DYNAMIC_FRAMERATE;
	gameName = 'Platformer Game';

	constructor() {
		super();
		this.loadAssets();
	}

	loadAssets() {
		AssetManager.loadImage('trollface.png', 'TrollFace');
		AssetManager.loadImage('roadmap.png', 'Background');
		AssetManager.loadImage('smiley.png', 'Smiley');
		AssetManager.loadImage('cursor.png', 'Cursor');
	}

	setupScenes() {
		{
			let gameScene = new Scene('Game');
			let background = Scene.createGameObject('Background');
			let bgImage = AssetManager.getImage('Background');
			let sr = new SpriteRenderer();
			sr.setSprite(
				new Sprite(bgImage, SpriteLayer.BACKGROUND, new Vector2(0.5, 0.5), 0.5)
			);
			background.addComponent(sr);
			gameScene.addGameObject(background);

			{
				let player = Scene.createGameObject('Player');
				player.transform.position = new Vector2(
					Math.random() * 400,
					Math.random() * 400
				);
				let image = AssetManager.getImage('Smiley');
				let b = new SpriteRenderer();
				b.setSprite(
					new Sprite(
						image,
						SpriteLayer.FOREGROUND,
						new Vector2(0.5, 0.5),
						2,
						false
					)
				);
				player.addComponent(b);
				player.addComponent(new MovementScript());
				gameScene.addGameObject(player);
				let camera = Scene.createGameObject('Camera');
				let cam = new Camera();
				cam.controller = new PlatformerCameraController();
				cam.target = player;
				cam.position = Vector2.copy(player.transform.position);
				camera.addComponent(cam);
				let cursor = Scene.createGameObject('Cursor');
				cursor.addComponent(new CursorManager());
				let cursorSpriteRender = new SpriteRenderer();
				cursorSpriteRender.setSprite(
					new Sprite(
						AssetManager.getImage('Cursor'),
						SpriteLayer.CURSOR,
						new Vector2(0, 0),
						0.75,
						false,
						true
					)
				);
				cursor.addComponent(cursorSpriteRender);
				gameScene.addGameObject(cursor);
				gameScene.addGameObject(camera);
			}
			this.addScene(gameScene);
		}
		{
			let mainMenu = new Scene('Main Menu');

			let cursor = Scene.createGameObject('Cursor');
			cursor.addComponent(new CursorManager());
			let cursorSpriteRender = new SpriteRenderer();
			cursorSpriteRender.setSprite(
				new Sprite(
					AssetManager.getImage('Cursor'),
					SpriteLayer.CURSOR,
					new Vector2(0, 0),
					0.75,
					false,
					true
				)
			);
			cursor.addComponent(cursorSpriteRender);

			mainMenu.addGameObject(cursor);
			//make cam
			let camera = Scene.createGameObject('Camera');
			let cam = new Camera();
			//c.controller = new PlatformerCameraController();
			camera.addComponent(cam);
			mainMenu.addGameObject(camera);

			let gui = Scene.createGameObject('GUI');
			gui.addComponent(new DynamicMenuMovement());
			mainMenu.addGameObject(gui);

			let menuBox = Scene.createGameObject('Menu');
			let guiBox = new GuiBox();
			guiBox.fillColor = 'Cornsilk';
			guiBox.width = 240 * 1.5;
			guiBox.height = 20 * 20;
			menuBox.addComponent(guiBox);
			gui.addChildGameObject(menuBox);

			//MAKES BUTTON
			{
				let button = Scene.createGameObject('Button');
				let bRenderer = new GuiButton();
				bRenderer.text = 'Start Game';
				bRenderer.font = 'Impact';
				bRenderer.textSize = 15;
				bRenderer.width = 200;
				bRenderer.hoverColor = 'DarkMagenta	';
				bRenderer.fillColor = 'Plum';
				bRenderer.textColor = 'White ';
				bRenderer.texStroke = true;
				bRenderer.textStrokeStyle = 'Black';
				bRenderer.textStrokeSize = 2;
				bRenderer.hoverStrokeSize = 2;
				bRenderer.onClick = () => {
					this.setScene('Game');
				};

				button.addComponent(bRenderer);
				gui.addChildGameObject(button);
			}
			//MAKES BUTTON
			{
				let a = Scene.createGameObject('Button');
				a.transform.position.y = -40;
				let bRendererA = new GuiButton();
				bRendererA.text = 'Open GitHub Page';
				bRendererA.font = 'Impact';
				bRendererA.textSize = 15;
				bRendererA.width = 200;
				bRendererA.hoverColor = 'DarkMagenta	';
				bRendererA.fillColor = 'Red';
				bRendererA.textColor = 'White ';
				bRendererA.texStroke = true;
				bRendererA.textStrokeStyle = 'Black';
				bRendererA.textStrokeSize = 2;
				bRendererA.hoverStrokeSize = 2;
				bRendererA.onClick = () => {
					window.open('https://github.com/prank855/Project-Alpha', '_blank');
				};

				a.addComponent(bRendererA);
				gui.addChildGameObject(a);
			}

			let menuImage = Scene.createGameObject('Menu Image');
			let sr = new SpriteRenderer();
			menuImage.addComponent(sr);
			sr.setSprite(
				new Sprite(
					AssetManager.getImage('Smiley'),
					SpriteLayer.GUI,
					new Vector2(0.5, 0.5),
					5,
					false
				)
			);
			menuImage.transform.position.y = 100;
			gui.addChildGameObject(menuImage);

			this.addScene(mainMenu);
		}
		this.setScene('Main Menu');
	}
	start() {}

	update() {
		SpriteRenderer.drawCount = 0;
		SpriteManager.sprites.length = 0;
		if (this.currentScene) {
			this.currentScene.update();
		}
		if (document.visibilityState == 'visible') {
			SpriteManager.render();
			this.drawSceneHierarchy();
		}
	}

	drawSceneHierarchy() {
		let fontSize = 15;
		let buffer = 5;
		let height = buffer + this.currentScene.getGameObjectsLength();

		let ctx = CanvasCreator.context;
		if (ctx) {
			let pos = new Vector2(0, innerHeight - height * fontSize);
			ctx.fillStyle = 'rgba(128,127,255,0.8)';
			ctx.fillRect(pos.x, pos.y, 200, innerHeight - height * fontSize);
			ctx.font = `${fontSize}px Consolas`;
			ctx.fillStyle = 'White';
			ctx.fillText('Scene Hierarchy', pos.x + fontSize, pos.y + fontSize * 2);
			ctx.fillText(
				`"${this.currentScene.sceneName}"`,
				pos.x + fontSize,
				pos.y + fontSize * 3
			);
			let line = buffer;
			for (let go of this.currentScene.getGameObjects()) {
				let text = `${go.name}`;
				if (go.children.length > 0) {
					text += ` + ${go.children.length} Children`;
				}
				ctx.fillText(text, pos.x + fontSize, pos.y + fontSize * line);
				line++;
			}
		}
	}
}
