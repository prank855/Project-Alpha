export class Util {
	static bound(value: number, min: number, max: number): number {
		let temp = value;
		if (temp < min) temp = min;
		if (temp > max) temp = max;
		return temp;
	}
}
