class Scrap {
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.angle = Math.random() * Math.PI * 2;
        this.size = Math.random() + 0.5;
        this.life = 75 * this.size;
        this.mined = false;
        this.hitboxPoints = [];
        this.rayed = false;
    }

    update() {
        this.pos.sub(player.spd);
    }
    
    hit() {
        this.life--;
        if (this.life <= 0) {
            this.mined = true;
        }
    }

    getHitboxPoint() {
        let points = []
        for (let i = 0; i < this.hitboxPoints.length; i++) {
            points[i] = Vector.add(this.pos, this.hitboxPoints[i]);
        }
        return points;
    }
    
    draw(ctx) {}
}