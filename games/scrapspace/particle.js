class Particle {
    constructor(x, y, sx, sy, size, lifetime, fillColor, strokeColor) {
        this.pos = new Vector(x, y);
        this.spd = new Vector(sx, sy);
        this.size = size;
        this.lifetime = lifetime;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
    }

    update() {
        this.pos.add(this.spd);
        this.pos.sub(player.spd);
        this.lifetime--;
    }

    draw(ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = 1;

        ctx.translate(this.pos.x, this.pos.y);
        
        ctx.fillRect(-this.size/2 * Math.min(this.lifetime/100, 1), -this.size/2 * Math.min(this.lifetime/100, 1), this.size * Math.min(this.lifetime/100, 1), this.size * Math.min(this.lifetime/100, 1));
        ctx.strokeRect(-this.size/2 * Math.min(this.lifetime/100, 1), -this.size/2 * Math.min(this.lifetime/100, 1), this.size * Math.min(this.lifetime/100, 1), this.size * Math.min(this.lifetime/100, 1));

        ctx.translate(-this.pos.x, -this.pos.y);
    }
}