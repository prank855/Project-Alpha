export class Prefab {
	name: string = '';
	// [componentName,[componentProperty,propertyValue][]]
	components: [string, [string, number | string | boolean][]][] = [];
}
