class AfricScrap extends Scrap {
    constructor(x, y) {
        super(x, y);

        this.hitboxPoints.push(new Vector(-15 * this.size, -3 * this.size));
        this.hitboxPoints.push(new Vector(-4 * this.size, -15 * this.size));
        this.hitboxPoints.push(new Vector(15 * this.size, -4 * this.size));
        this.hitboxPoints.push(new Vector(7 * this.size, 15 * this.size));
        this.hitboxPoints.push(new Vector(0 * this.size, 15 * this.size));
        this.hitboxPoints.push(new Vector(-4 * this.size, 4 * this.size));
        this.hitboxPoints.push(new Vector(-15 * this.size, 4 * this.size));

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
        ctx.moveTo(-15 * this.size, -3 * this.size);
        ctx.lineTo(-4 * this.size, -15 * this.size);
        ctx.lineTo(15 * this.size, -4 * this.size);
        ctx.lineTo(7 * this.size, 15 * this.size);
        ctx.lineTo(0 * this.size, 15 * this.size);
        ctx.lineTo(-4 * this.size, 4 * this.size);
        ctx.lineTo(-15 * this.size, 4 * this.size);
        ctx.lineTo(-15 * this.size, -3 * this.size);
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