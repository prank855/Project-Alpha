import { GameObject } from './GameObject';

export class GameComponent {
	parent: GameObject | null = null;
	debug: boolean = false;
	name: string;
	constructor(componentName: string) {
		this.name = componentName;
		if (componentName == null) {
			throw 'A Component has not been named in super()';
		}
	}
	init() {} //called when component added to Game Object
	start() {} //called when Game Object is added to GameObjectManager
	update() {} //called each frame
	render() {} //called each frame
	onDebug() {} // called each frame if this.debug is set to True
}
