class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static add(vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    static sub(vector1, vector2) {
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
    }

    static dist(vector1, vector2) {
        return Math.sqrt((vector2.x - vector1.x) * (vector2.x - vector1.x) + (vector2.y - vector1.y) * (vector2.y - vector1.y))
    }

    static collide(vectorA, vectorB, vectorC, vectorD){
        let uA = ((vectorD.x-vectorC.x)*(vectorA.y-vectorC.y) - (vectorD.y-vectorC.y)*(vectorA.x-vectorC.x)) / ((vectorD.y-vectorC.y)*(vectorB.x-vectorA.x) - (vectorD.x-vectorC.x)*(vectorB.y-vectorA.y));
        let uB = ((vectorB.x-vectorA.x)*(vectorA.y-vectorC.y) - (vectorB.y-vectorA.y)*(vectorA.x-vectorC.x)) / ((vectorD.y-vectorC.y)*(vectorB.x-vectorA.x) - (vectorD.x-vectorC.x)*(vectorB.y-vectorA.y));
        return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
    };

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    rotate(angle) {
        let newX = Math.cos(angle) * this.x - Math.sin(angle) * this.y;
        let newY = Math.sin(angle) * this.x + Math.cos(angle) * this.y;
        this.x = newX;
        this.y = newY;
    }

    setMag(mag) {
        this.normalize();
        this.mult(mag);
    }

    normalize() {
        this.divide(this.mag());
    }

    limit(mag) {
        if (this.mag() > mag) this.setMag(mag);
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    mult(num) {
        this.x *= num;
        this.y *= num;
    }

    divide(num) {
        this.x /= num;
        this.y /= num;
    }
}