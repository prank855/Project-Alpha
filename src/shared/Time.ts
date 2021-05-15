export class Time {
	static deltaTime: number = 0;
	static elapsedTime: number = 0;
	static getCurrTime(): number {
		return performance.now() / 1000;
	}
}
