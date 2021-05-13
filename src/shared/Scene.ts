import { GameObjectManager } from './GameObjectManager';
import { Prefab } from './Prefab';
export class Scene {
	prefabs: Prefab[] = [];
	create(objectHandler: GameObjectManager) {
		//TODO: Create Scene Code
		console.log('TODO: CREATE SCENE CODE');
		for (var p of this.prefabs) {
			objectHandler.addGameObject(p.create());
		}
	}
}
