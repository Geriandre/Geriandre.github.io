class SquareScrap extends Scrap {
    constructor(x, y) {
        super(x, y);

        this.hitboxPoints.push(new Vector(-13 * this.size, 0 * this.size));
        this.hitboxPoints.push(new Vector(-13 * this.size, -5 * this.size));
        this.hitboxPoints.push(new Vector(8 * this.size, -10 * this.size));
        this.hitboxPoints.push(new Vector(10 * this.size, -8 * this.size));
        this.hitboxPoints.push(new Vector(10 * this.size, 3 * this.size));
        this.hitboxPoints.push(new Vector(5 * this.size, 8 * this.size));
        this.hitboxPoints.push(new Vector(0 * this.size, 9 * this.size));

        this.hitboxPoints.forEach((pt) => {
            pt.rotate(this.angle);
        })
    }

    draw(ctx) {
        if (this.pos.x > width + 50 || this.pos.x < -50 || this.pos.y > height + 50 || this.pos.y < -50) return;
        ctx.fillStyle = "#3c3c3c";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 4;

        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle);
        
        ctx.beginPath();
        ctx.moveTo(-13 * this.size, 0 * this.size);
        ctx.lineTo(-13 * this.size, -5 * this.size);
        ctx.lineTo(8 * this.size, -10 * this.size);
        ctx.lineTo(10 * this.size, -8 * this.size);
        ctx.lineTo(10 * this.size, 3 * this.size);
        ctx.lineTo(5 * this.size, 8 * this.size);
        ctx.lineTo(0 * this.size, 9 * this.size);
        ctx.lineTo(-13 * this.size, 0 * this.size);
        ctx.stroke();
        ctx.fill();
        
        ctx.rotate(-this.angle);
        ctx.translate(-this.pos.x, -this.pos.y);

        if (!DEBUG) return;

        ctx.strokeStyle = "#ff0000";
        ctx.beginPath();
        ctx.moveTo(this.hitboxPoints[this.hitboxPoints.length - 1].x + this.pos.x, this.hitboxPoints[this.hitboxPoints.length - 1].y + this.pos.y);
        this.hitboxPoints.forEach((pt) => {
            ctx.lineTo(pt.x + this.pos.x, pt.y + this.pos.y);
        })
        ctx.stroke();
    }
}