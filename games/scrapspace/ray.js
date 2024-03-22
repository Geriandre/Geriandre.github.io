const rayReach = 600;

class Ray {
    constructor(source, dest, lvl) {
        this.source = source;
        this.dest = dest;
        this.dest.rayed = true;
        this.lvl = lvl;
        this.connected = true;
        if (this.lvl < 4) {
            let nextLvl = this.lvl + 1;
            let closest = scraps[0];
            for (let i = 0; i < scraps.length; i++) {
                let dist = Vector.dist(this.dest.pos, scraps[i].pos)
                if (dist < Vector.dist(this.dest.pos, closest.pos) && dist > 0 && !scraps[i].rayed) {
                    closest = scraps[i];
                }
            }
            if (Vector.dist(this.dest.pos, closest.pos) < rayReach / nextLvl) {
                this.child = new Ray(this.dest, closest, nextLvl);
            }
        }
    }

    getPoints() {
        let points = [];
        if (this.lvl == 1) points.push(this.source.pos);
        points.push(this.dest.pos);
        if (this.child) {
            this.child.getPoints().forEach((pt) => {
                points.push(pt);
            });
        }
        return points;
    }

    update() {
        if (Vector.dist(this.source.pos, this.dest.pos) > rayReach) {
            this.connected = false;
            this.dest.rayed = false;
        }
        if (this.dest.mined) this.connected = false;
        if (this.child) {
            if (!this.connected) this.child.connected = false;
            this.child.update();
        }
        if (this.child && !this.child.connected) this.child = null;
        if (!this.connected) {
            this.child = null;
            this.dest.rayed = false;
        }
    }

    draw(ctx) {
        ctx.strokeStyle = "rgb(214, 48, 49, " + (1 - ((this.lvl / 5))) + ")";
        ctx.fillStyle = "rgb(214, 48, 49, " + (1 - ((this.lvl / 5))) + ")";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(this.source.pos.x, this.source.pos.y);
        ctx.lineTo(this.dest.pos.x, this.dest.pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(this.source.pos.x, this.source.pos.y, 4, 4, 0, 0, Math.PI * 2);
        ctx.ellipse(this.dest.pos.x, this.dest.pos.y, 4, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        if (this.child) this.child.draw(ctx);
    }
}