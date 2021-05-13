import { GameObject } from './GameObject';
import { InputAction } from './InputAction';

export class GameComponent {
	parent: GameObject | null = null;
	debug: boolean = false;
	name: string;
	isNetworked: boolean = true;
	netProps: string[] = [];
	constructor(componentName: string) {
		this.name = componentName;
	}
	init() {} //called when component added to Game Object
	start() {} //called when Game Object is added to GameObjectManager
	update() {} //called each frame
	input(_inputs: InputAction[]) {} //called each frame
	render() {} //called each frame
	onDebug() {} // called each frame if this.debug is set to True
}
