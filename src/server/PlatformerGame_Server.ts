import { GameComponent } from './../shared/GameComponent';
import { ServerNetworkManager } from './ServerNetworkManager';
import { Scene } from './../shared/Scene';
import { Game } from '../shared/Game';
export class PlatformerGame_Server extends Game {
	frameRate = 20;
	gameName = 'Platformer Game';

	constructor() {
		super();
	}

	setup() {
		console.log('Setup Game Server');
		/* Server Game Scene */ {
			var serverGameScene = new Scene('Server Game');
			this.addScene(serverGameScene);
			/**Network Manager */ {
				let networkObj = Scene.createGameObject('Server Network Manager');
				let networkManager = new ServerNetworkManager();
				networkManager.host();
				networkObj.addComponent(networkManager);
				serverGameScene.addGameObject(networkObj);
			}
			/**Game Container */ {
				var gameContainerObj = Scene.createGameObject('Game Container');
				let com = new GameComponent('ServerGameManager');
				com.update = () => {
					//TODO game loop
				};
				gameContainerObj.addComponent(com);
				serverGameScene.addGameObject(gameContainerObj);
			}
		}
		this.setScene('Server Game');
	}

	start() {}

	update() {
		this.currentScene.update();
	}
}
