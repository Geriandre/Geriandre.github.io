const cubeStartSpeed = 0.15;
const cubeAccel = 0.00005;
const cubeMaxSpeed = 1;
const cubeSize = 100;

class Cube {
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.speed = cubeStartSpeed;
        this.spd = new Vector(0, 0);
        this.hp = cubeHealth;

        this.hitboxPoints = [];
        this.hitboxPoints.push(new Vector(-cubeSize/2, -cubeSize/2));
        this.hitboxPoints.push(new Vector(cubeSize/2, -cubeSize/2));
        this.hitboxPoints.push(new Vector(cubeSize/2, cubeSize/2));
        this.hitboxPoints.push(new Vector(-cubeSize/2, cubeSize/2));
    }

    getHitboxPoint() {
        if (this.hp <= 0) return [];
        let points = []
        for (let i = 0; i < this.hitboxPoints.length; i++) {
            points[i] = Vector.add(this.pos, this.hitboxPoints[i]);
        }
        return points;
    }

    update() {
        this.pos.add(this.spd);
        this.pos.sub(player.spd);
        
        this.spawnRays();
        this.aim();
        if (this.speed < cubeMaxSpeed) this.speed += cubeAccel;
    }

    spawnRays() {
        scraps.forEach((scrap) => {
            if (Vector.dist(this.pos, scrap.pos) <= rayReach && !scrap.rayed) {
                rays.push(new Ray(this, scrap, 1));
            }
        })
    }

    aim() {
        let dir = Vector.sub(player.pos, this.pos);
        let rot = dir.heading();
        this.spd = new Vector(this.speed, 0);
        this.spd.rotate(rot);
    }

    draw(ctx) {
        if (this.hp <= 0) return;

        ctx.fillStyle = "#3c3c3c";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        let larg = cubeSize/2;

        ctx.translate(this.pos.x, this.pos.y);

        ctx.beginPath();
        ctx.moveTo(-larg, - larg);
        ctx.lineTo(larg, -larg);
        ctx.lineTo(larg, larg);
        ctx.lineTo(-larg, larg);
        ctx.lineTo(-larg, -larg);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-larg, -larg);
        ctx.lineTo(-larg/3, -larg/3);
        ctx.moveTo(larg, -larg);
        ctx.lineTo(larg/3, -larg/3);
        ctx.moveTo(larg, larg);
        ctx.lineTo(larg/3, larg/3);
        ctx.moveTo(-larg, larg);
        ctx.lineTo(-larg/3, larg/3);
        ctx.stroke();

        ctx.fillStyle = "#d63031";
        ctx.beginPath();
        ctx.moveTo(-larg/3, -larg/3);
        ctx.lineTo(larg/3, -larg/3);
        ctx.lineTo(larg/3, larg/3);
        ctx.lineTo(-larg/3, larg/3);
        ctx.lineTo(-larg/3, -larg/3);
        ctx.fill();
        ctx.stroke();

        ctx.translate(-this.pos.x, -this.pos.y);
    }
}