class Star {
    constructor(x, y, size) {
        this.pos = new Vector(x, y);
        this.size = size;
    }

    draw(ctx) {
        ctx.fillStyle = '#FFFFAA';
        ctx.beginPath();
        ctx.ellipse(this.pos.x, this.pos.y, this.size, this.size, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
}