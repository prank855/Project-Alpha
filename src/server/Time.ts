export class Time {
  static deltaTime: number = 0;
  static elapsedTime: number = 0;
  static getCurrTime() {
    var hrTime = process.hrtime();
    return (hrTime[0] * 1000000 + hrTime[1] / 1000) / 1000;
  }
}
