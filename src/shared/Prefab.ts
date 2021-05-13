import { GameObject } from './GameObject';
export class Prefab {
	name: string = 'Unnamed Prefab';
	components: [string, [string, any][]][] = [];
	create(): GameObject {
		var temp = new GameObject(this.name);
		return temp;
	}
}
