export class Vector2 {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	static zero() {
		return new Vector2(0, 0);
	}

	add(vec: Vector2): Vector2 {
		this.x += vec.x;
		this.y += vec.y;
		return this;
	}

	multiply(value: number | Vector2): Vector2 {
		if (value instanceof Vector2) {
			this.x *= value.x;
			this.y *= value.y;
		} else {
			this.x *= value;
			this.y *= value;
		}
		return this;
	}
	divide(value: number): Vector2 {
		if (value == 0) {
			return this;
		}
		this.x /= value;
		this.y /= value;
		return this;
	}

	normalize() {
		this.divide(this.getMagnitude());
		return this;
	}

	toString(): string {
		return `X: ${this.x.toFixed(2)}, Y: ${this.y.toFixed(2)}`;
	}

	getMagnitude(): number {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	static copy(vec: Vector2): Vector2 {
		return new Vector2(vec.x, vec.y);
	}

	static add(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x + b.x, a.y + b.y);
	}
	static multiply(a: Vector2, b: Vector2): Vector2 {
		return new Vector2(a.x * b.x, a.y * b.y);
	}
}
