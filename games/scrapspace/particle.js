class Particle {
    constructor(x, y, sx, sy, size, lifetime, fillColor, strokeColor) {
        this.pos = new Vector(x, y);
        this.spd = new Vector(sx, sy);
        this.size = size;
        this.lifetime = lifetime;
        this.maxLifetime = lifetime;
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
        
        let x = -this.size/2 * Math.min(this.lifetime/this.maxLifetime, 1);
        let y = -this.size/2 * Math.min(this.lifetime/this.maxLifetime, 1);
        let w = this.size * Math.min(this.lifetime/this.maxLifetime, 1);
        ctx.fillRect(x, y, w, w);
        ctx.strokeRect(x, y, w, w);

        ctx.translate(-this.pos.x, -this.pos.y);
    }
}