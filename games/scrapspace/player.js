const panelExtensionSpeed = 0.03;
const batteryRunOutSpeed = 0.05;
const batteryChargeSpeed = 0.1;
const rotationSpeed = 0.03;
const laserEnergyConsumption = 0.3;
const thrusterForce = 0.02;
const fuelComsumption = 0.08;
const collisionRadius = 120;
const deathSpeed = 1;

class Player {
    constructor() {
        this.pos = new Vector(width/2, height/2);
        this.spd = new Vector(0, 0);
        this.angle = 0;
        this.lastAngle = 0;
        this.targetAngle = 0;
        this.target = new Vector(0, 0);
        this.panelsOut = true;
        this.panelLeft = true;
        this.panelRight = true;
        this.panelsExtension = 0.08;
        this.battery = 100;
        this.hp = 3;
        this.fuel = 100;
        this.laserOn = false;
        this.laserInputOn = false;
        this.thrusterOn = false;

        this.hitboxA = new Vector(0, 0);
        this.hitboxB = new Vector(0, 0);
        this.hitboxC = new Vector(0, 0);
        this.hitboxD = new Vector(0, 0);

        this.rightPanelHitboxA = new Vector(0, 0);
        this.rightPanelHitboxB = new Vector(0, 0);
        this.rightPanelHitboxC = new Vector(0, 0);
        this.rightPanelHitboxD = new Vector(0, 0);

        this.leftPanelHitboxA = new Vector(0, 0);
        this.leftPanelHitboxB = new Vector(0, 0);
        this.leftPanelHitboxC = new Vector(0, 0);
        this.leftPanelHitboxD = new Vector(0, 0);

        this.alive = true;
    }

    update() {
        if (!this.alive) return;
        this.pos = new Vector(width/2, height/2);

        this.panelCheck();
        this.batteryCheck();
        this.aim();
        this.thrusterCheck();
        this.collisionCheck();
    }

    collisionCheck() {
        this.hitboxA.x = this.pos.x + Math.cos(this.angle - Math.PI/4.5) * 25;
        this.hitboxA.y = this.pos.y + Math.sin(this.angle - Math.PI/4.5) * 25; 
        this.hitboxB.x = this.pos.x + Math.cos(this.angle + Math.PI/4.5) * 25;
        this.hitboxB.y = this.pos.y + Math.sin(this.angle + Math.PI/4.5) * 25;
        this.hitboxC.x = this.pos.x + Math.cos(this.angle + Math.PI - Math.PI/4) * 30;
        this.hitboxC.y = this.pos.y + Math.sin(this.angle + Math.PI - Math.PI/4) * 30;
        this.hitboxD.x = this.pos.x + Math.cos(this.angle - Math.PI + Math.PI/4) * 30;
        this.hitboxD.y = this.pos.y + Math.sin(this.angle - Math.PI + Math.PI/4) * 30;

        this.leftPanelHitboxA.x = this.pos.x + Math.cos(this.angle - 1.75) * 30;
        this.leftPanelHitboxA.y = this.pos.y + Math.sin(this.angle - 1.75) * 30;
        this.leftPanelHitboxB.x = this.pos.x + Math.cos(this.angle - 2.3) * 35;
        this.leftPanelHitboxB.y = this.pos.y + Math.sin(this.angle - 2.3) * 35;
        this.leftPanelHitboxD.x = this.pos.x + Math.cos(this.angle - 1.8) * (76 * this.panelsExtension + 35);
        this.leftPanelHitboxD.y = this.pos.y + Math.sin(this.angle - 1.8) * (76 * this.panelsExtension + 35) ;
        this.leftPanelHitboxC.x = this.leftPanelHitboxD.x + Math.cos(this.angle - 3.4) * 18;
        this.leftPanelHitboxC.y = this.leftPanelHitboxD.y + Math.sin(this.angle - 3.4) * 18;

        this.rightPanelHitboxA.x = this.pos.x + Math.cos(this.angle + 1.75) * 30;
        this.rightPanelHitboxA.y = this.pos.y + Math.sin(this.angle + 1.75) * 30;
        this.rightPanelHitboxB.x = this.pos.x + Math.cos(this.angle + 2.3) * 35;
        this.rightPanelHitboxB.y = this.pos.y + Math.sin(this.angle + 2.3) * 35;
        this.rightPanelHitboxD.x = this.pos.x + Math.cos(this.angle + 1.8) * (76 * this.panelsExtension + 35);
        this.rightPanelHitboxD.y = this.pos.y + Math.sin(this.angle + 1.8) * (76 * this.panelsExtension + 35) ;
        this.rightPanelHitboxC.x = this.rightPanelHitboxD.x + Math.cos(this.angle + 3.4) * 18;
        this.rightPanelHitboxC.y = this.rightPanelHitboxD.y + Math.sin(this.angle + 3.4) * 18;

        // cube collision
        if (Vector.dist(cube.pos, this.pos) < collisionRadius*2) {
            let cubeHitboxPoints = cube.getHitboxPoint();
            //A-B
            let currentPoint = cubeHitboxPoints[cubeHitboxPoints.length - 1];
            cubeHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.hitboxA, this.hitboxB, currentPoint, pt)) {
                    this.die();
                }
                currentPoint = pt;
            });
            //B-C
            currentPoint = cubeHitboxPoints[cubeHitboxPoints.length - 1];
            cubeHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.hitboxB, this.hitboxC, currentPoint, pt)) {
                    this.die();
                }
                currentPoint = pt;
            });
            //C-D
            currentPoint = cubeHitboxPoints[cubeHitboxPoints.length - 1];
            cubeHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.hitboxC, this.hitboxD, currentPoint, pt)) {
                    this.die();
                }
                currentPoint = pt;
            });
            //D-A
            currentPoint = cubeHitboxPoints[cubeHitboxPoints.length - 1];
            cubeHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.hitboxD, this.hitboxA, currentPoint, pt)) {
                    this.die();
                }
                currentPoint = pt;
            });

            //panels
            //PanelLeft A-B
            currentPoint = cubeHitboxPoints[cubeHitboxPoints.length - 1];
            cubeHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.leftPanelHitboxA, this.leftPanelHitboxB, currentPoint, pt)) {
                    this.panelCollide("left");
                }
                currentPoint = pt;
            });
            //PanelLeft B-C
            currentPoint = cubeHitboxPoints[cubeHitboxPoints.length - 1];
            cubeHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.leftPanelHitboxB, this.leftPanelHitboxC, currentPoint, pt)) {
                    this.panelCollide("left");
                }
                currentPoint = pt;
            });
            //PanelLeft C-D
            currentPoint = cubeHitboxPoints[cubeHitboxPoints.length - 1];
            cubeHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.leftPanelHitboxC, this.leftPanelHitboxD, currentPoint, pt)) {
                    this.panelCollide("left");
                }
                currentPoint = pt;
            });
            //PanelRight D-A
            currentPoint = cubeHitboxPoints[cubeHitboxPoints.length - 1];
            cubeHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.rightPanelHitboxD, this.rightPanelHitboxA, currentPoint, pt)) {
                    this.panelCollide("right");
                }
                currentPoint = pt;
            });

            //PanelRight A-B
            currentPoint = cubeHitboxPoints[cubeHitboxPoints.length - 1];
            cubeHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.rightPanelHitboxA, this.rightPanelHitboxB, currentPoint, pt)) {
                    this.panelCollide("right");
                }
                currentPoint = pt;
            });
            //PanelRight B-C
            currentPoint = cubeHitboxPoints[cubeHitboxPoints.length - 1];
            cubeHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.rightPanelHitboxB, this.rightPanelHitboxC, currentPoint, pt)) {
                    this.panelCollide("right");
                }
                currentPoint = pt;
            });
            //PanelRight C-D
            currentPoint = cubeHitboxPoints[cubeHitboxPoints.length - 1];
            cubeHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.rightPanelHitboxC, this.rightPanelHitboxD, currentPoint, pt)) {
                    this.panelCollide("right");
                }
                currentPoint = pt;
            });
            //PanelRight D-A
            currentPoint = cubeHitboxPoints[cubeHitboxPoints.length - 1];
            cubeHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.rightPanelHitboxD, this.rightPanelHitboxA, currentPoint, pt)) {
                    this.panelCollide("right");
                }
                currentPoint = pt;
            });
        }

        // ray collision
        rays.forEach((ray) => {
            let points = ray.getPoints();
            //A-B
            let currentPoint = points[0];
            points.forEach((pt) => {
                if(Vector.collide(this.hitboxA, this.hitboxB, currentPoint, pt)) {
                    this.die();
                }
                currentPoint = pt;
            });
            //B-C
            currentPoint = points[0];
            points.forEach((pt) => {
                if(Vector.collide(this.hitboxB, this.hitboxC, currentPoint, pt)) {
                    this.die();
                }
                currentPoint = pt;
            });
            //C-D
            currentPoint = points[0];
            points.forEach((pt) => {
                if(Vector.collide(this.hitboxC, this.hitboxD, currentPoint, pt)) {
                    this.die();
                }
                currentPoint = pt;
            });
            //D-A
            currentPoint = points[0];
            points.forEach((pt) => {
                if(Vector.collide(this.hitboxD, this.hitboxA, currentPoint, pt)) {
                    this.die();
                }
                currentPoint = pt;
            });
        });

        // scrap collision
        scraps.forEach((scrap) => {
            if (Vector.dist(scrap.pos, this.pos) > collisionRadius) return;
            let ScrapHitboxPoints = scrap.getHitboxPoint();
            //A-B
            let currentPoint = ScrapHitboxPoints[ScrapHitboxPoints.length - 1];
            ScrapHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.hitboxA, this.hitboxB, currentPoint, pt)) {
                    this.collide(scrap);
                }
                currentPoint = pt;
            });
            //B-C
            currentPoint = ScrapHitboxPoints[ScrapHitboxPoints.length - 1];
            ScrapHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.hitboxB, this.hitboxC, currentPoint, pt)) {
                    this.collide(scrap);
                }
                currentPoint = pt;
            });
            //C-D
            currentPoint = ScrapHitboxPoints[ScrapHitboxPoints.length - 1];
            ScrapHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.hitboxC, this.hitboxD, currentPoint, pt)) {
                    this.collide(scrap);
                }
                currentPoint = pt;
            });
            //D-A
            currentPoint = ScrapHitboxPoints[ScrapHitboxPoints.length - 1];
            ScrapHitboxPoints.forEach((pt) => {
                if(Vector.collide(this.hitboxD, this.hitboxA, currentPoint, pt)) {
                    this.collide(scrap);
                }
                currentPoint = pt;
            });

            if (this.panelsExtension <= 0.08) return;

            if (this.panelLeft) {
                //PanelLeft A-B
                currentPoint = ScrapHitboxPoints[ScrapHitboxPoints.length - 1];
                ScrapHitboxPoints.forEach((pt) => {
                    if(Vector.collide(this.leftPanelHitboxA, this.leftPanelHitboxB, currentPoint, pt)) {
                        this.panelCollide("left");
                    }
                    currentPoint = pt;
                });
                //PanelLeft B-C
                currentPoint = ScrapHitboxPoints[ScrapHitboxPoints.length - 1];
                ScrapHitboxPoints.forEach((pt) => {
                    if(Vector.collide(this.leftPanelHitboxB, this.leftPanelHitboxC, currentPoint, pt)) {
                        this.panelCollide("left");
                    }
                    currentPoint = pt;
                });
                //PanelLeft C-D
                currentPoint = ScrapHitboxPoints[ScrapHitboxPoints.length - 1];
                ScrapHitboxPoints.forEach((pt) => {
                    if(Vector.collide(this.leftPanelHitboxC, this.leftPanelHitboxD, currentPoint, pt)) {
                        this.panelCollide("left");
                    }
                    currentPoint = pt;
                });
                //PanelLeft D-A
                currentPoint = ScrapHitboxPoints[ScrapHitboxPoints.length - 1];
                ScrapHitboxPoints.forEach((pt) => {
                    if(Vector.collide(this.leftPanelHitboxD, this.leftPanelHitboxA, currentPoint, pt)) {
                        this.panelCollide("left");
                    }
                    currentPoint = pt;
                });
            }

            if (this.panelRight) {
                //PanelRight A-B
                currentPoint = ScrapHitboxPoints[ScrapHitboxPoints.length - 1];
                ScrapHitboxPoints.forEach((pt) => {
                    if(Vector.collide(this.rightPanelHitboxA, this.rightPanelHitboxB, currentPoint, pt)) {
                        this.panelCollide("right");
                    }
                    currentPoint = pt;
                });
                //PanelRight B-C
                currentPoint = ScrapHitboxPoints[ScrapHitboxPoints.length - 1];
                ScrapHitboxPoints.forEach((pt) => {
                    if(Vector.collide(this.rightPanelHitboxB, this.rightPanelHitboxC, currentPoint, pt)) {
                        this.panelCollide("right");
                    }
                    currentPoint = pt;
                });
                //PanelRight C-D
                currentPoint = ScrapHitboxPoints[ScrapHitboxPoints.length - 1];
                ScrapHitboxPoints.forEach((pt) => {
                    if(Vector.collide(this.rightPanelHitboxC, this.rightPanelHitboxD, currentPoint, pt)) {
                        this.panelCollide("right");
                    }
                    currentPoint = pt;
                });
                //PanelRight D-A
                currentPoint = ScrapHitboxPoints[ScrapHitboxPoints.length - 1];
                ScrapHitboxPoints.forEach((pt) => {
                    if(Vector.collide(this.rightPanelHitboxD, this.rightPanelHitboxA, currentPoint, pt)) {
                        this.panelCollide("right");
                    }
                    currentPoint = pt;
                });
            }
        });
    }

    panelCollide(panel) {
        if (panel == "left" && this.panelLeft) {
            this.panelLeft = false;
            for (let i = 0; i < 10; i++) {
                let angle = this.angle - Math.PI + 1.2;
                let dist = Math.random() * 75 * this.panelsExtension + 25;
                let x = this.pos.x + Math.cos(angle) * dist;
                let y = this.pos.y + Math.sin(angle) * dist;
                particles.push(new Particle(x, y, this.spd.x + Math.random() * 0.5 - 0.25, this.spd.y + Math.random() * 0.5 - 0.25, 5, 150, "#0c2461", "#aaaaaa"));
            }
        }
        if (panel == "right" && this.panelRight) {
            this.panelRight = false;
            for (let i = 0; i < 10; i++) {
                let angle = this.angle + Math.PI - 1.2;
                let dist = Math.random() * 75 * this.panelsExtension + 25;
                let x = this.pos.x + Math.cos(angle) * dist;
                let y = this.pos.y + Math.sin(angle) * dist;
                particles.push(new Particle(x, y, this.spd.x + Math.random() * 0.5 - 0.25, this.spd.y + Math.random() * 0.5 - 0.25, 5, 150, "#0c2461", "#aaaaaa"));
            }
        }
    } 

    collide(scrap) {
        if (!this.alive) return;
        if (this.spd.mag() > deathSpeed) {
            this.die();
            return;
        } else {
            scrap.mined = true;
            for (let i = 0; i < 10; i++) {
                particles.push(new Particle(scrap.pos.x, scrap.pos.y, this.spd.x + Math.random() * 0.5 - 0.25, this.spd.y + Math.random() * 0.5 - 0.25, scrap.size * 10, 300, "#3c3c3c", "#000000"));
            }
            this.spd.rotate(Math.PI/2);
            this.spd.mult(0.5);
        }
    }

    die() {
        this.panelCollide("left");
        this.panelCollide("right");
        for (let i = 0; i < 30; i++) {
            if (Math.random() > 0.5) particles.push(new Particle(this.pos.x, this.pos.y, this.spd.x/2 + Math.random() * 1 - 0.5, this.spd.y/2 + Math.random() * 1 - 0.5, 10, 300, "#3c3c3c", "#000000"));
            else particles.push(new Particle(this.pos.x, this.pos.y, this.spd.x/2 + Math.random() * 1 - 0.5, this.spd.y/2 + Math.random() * 1 - 0.5, 10, 300, "#05c46b", "#000000"));
        }
        this.spd = new Vector(0, 0);
        this.alive = false;
        //start();
    }

    aim() {
        if (this.angle > Math.PI) this.angle -= Math.PI * 2;
        if (this.angle < -Math.PI) this.angle += Math.PI * 2;
        if (this.battery > 0) {
            let dif = this.angle - this.targetAngle;
            this.laserOn = false;
            if (dif > rotationSpeed) {
                if (dif > Math.PI) this.angle += rotationSpeed;
                else this.angle -= rotationSpeed;
            }
            else if (dif < -rotationSpeed) {
                if (dif < -Math.PI) this.angle -= rotationSpeed;
                else this.angle += rotationSpeed;
            }
            else {
                if (this.laserInputOn) this.laserOn = true;
            }
        }
    }

    thrusterCheck() {
        if (this.fuel > 100) this.fuel = 100;
        if (this.thrusterOn && this.fuel > 0) {
            let force = new Vector(thrusterForce * Math.cos(this.angle), thrusterForce * Math.sin(this.angle));

            let px = width/2 + Math.cos(this.angle - (Math.PI - 0.34)) * 30;
            let py = height/2 + Math.sin(this.angle - (Math.PI - 0.34)) * 30;
            let px2 = width/2 + Math.cos(this.angle - (Math.PI + 0.34)) * 30;
            let py2 = height/2 + Math.sin(this.angle - (Math.PI + 0.34)) * 30;
            let pxOff = Math.random() * 2 - 1;
            let pyOff = Math.random() * 2 - 1;
            let pxOff2 = Math.random() * 2 - 1;
            let pyOff2 = Math.random() * 2 - 1;
            let psxOff = Math.random() * 0.25 - 0.125;
            let psyOff = Math.random() * 0.25 - 0.125;
            let psxOff2 = Math.random() * 0.25 - 0.125;
            let psyOff2 = Math.random() * 0.25 - 0.125;
            particles.push(new Particle(px + pxOff, py + pyOff, this.spd.x - force.x * 4 + psxOff, this.spd.y - force.y * 4 + psyOff, 4, 100, "#05c46b", "#05c46b"));     
            particles.push(new Particle(px2 + pxOff2, py2 + pyOff2, this.spd.x - force.x * 4 + psxOff2, this.spd.y - force.y * 4 + psyOff2, 4, 100, "#05c46b", "#05c46b"));     
            
            this.spd.add(force);
            this.fuel -= fuelComsumption;
        }
    }

    panelCheck() {
        if (!this.panelLeft && !this.panelRight) {
            this.panelsExtension = 0;
            return;
        }
        if (this.panelsExtension > 0.08 && !this.panelsOut) {
            this.panelsExtension -= panelExtensionSpeed;
        }
        if (this.panelsExtension < 1 && this.panelsOut) {
            this.panelsExtension += panelExtensionSpeed;
        }
    }

    batteryCheck() {
        if (this.battery < 100 && this.panelsExtension >= 1 && this.panelLeft && this.panelRight) this.battery += 2 * batteryChargeSpeed;
        else if (this.battery < 100 && this.panelsExtension >= 1 && (this.panelLeft || this.panelRight)) this.battery += batteryChargeSpeed;
        else if (this.battery > 0) this.battery -= batteryRunOutSpeed;
        if (this.laserOn && this.battery > 0) this.battery -= laserEnergyConsumption;
        if (this.battery <= 0) {
            this.laserInputOn = false;
            this.laserOn = false;
        }
    }

    togglePanels() {
        this.panelsOut = !this.panelsOut
    }
    
    setTarget(vector) {
        this.targetAngle = Vector.sub(vector, this.pos).heading();
        this.target.x = vector.x;
        this.target.y = vector.y;
    }

    toggleLaser(value) {
        this.laserInputOn = value;
    }
    
    draw(ctx) {
        if (!this.alive) return;

        ctx.translate(width/2, height/2);
        ctx.rotate(this.angle);
        
        // drawing
        // solar panel attachment
        ctx.lineWidth = 1 ;
        ctx.fillStyle = "#3c3c3c";
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.ellipse(-12, -20, 5, 5, 0, 0, Math.PI *2);
        ctx.ellipse(-12, 20, 5, 5, 0, 0, Math.PI *2);
        ctx.fill();
        ctx.stroke();

        // body
        ctx.fillStyle = "#3C3C3C";
        ctx.beginPath();
        ctx.moveTo(-20, -20);
        ctx.lineTo(-20, 20);
        ctx.lineTo(20, 15);
        ctx.lineTo(20, -15);
        ctx.lineTo(-20, -20);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(20, -15);
        ctx.lineTo(-20, 0);
        ctx.lineTo(20, 15);
        ctx.stroke();

        // window
        ctx.fillStyle = "#74b9ff";
        ctx.beginPath();
        ctx.moveTo(10, -10);
        ctx.lineTo(10, 10);
        ctx.lineTo(0, 5);
        ctx.lineTo(0, -5);
        ctx.lineTo(10, -10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#81ecec";
        ctx.beginPath();
        ctx.moveTo(1, 0);
        ctx.lineTo(9, -5);
        ctx.lineTo(9, 0);
        ctx.lineTo(1, 5);
        ctx.fill();

        // vents
        ctx.beginPath();
        ctx.moveTo(-18, -15);
        ctx.lineTo(-10, -15);
        ctx.moveTo(-18, -11);
        ctx.lineTo(-10, -11);
        ctx.moveTo(-18, -7);
        ctx.lineTo(-10, -7);
        ctx.moveTo(-18, 15);
        ctx.lineTo(-10, 15);
        ctx.moveTo(-18, 11);
        ctx.lineTo(-10, 11);
        ctx.moveTo(-18, 7);
        ctx.lineTo(-10, 7);
        ctx.stroke();

        // guns
        ctx.fillStyle = "#3c3c3c";
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(24, -18);
        ctx.lineTo(24, -20);
        ctx.lineTo(-5, -20);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, 18);
        ctx.lineTo(24, 18);
        ctx.lineTo(24, 20);
        ctx.lineTo(-5, 20);
        ctx.fill();

        // thrusters
        ctx.fillStyle = "#3c3c3c";
        ctx.beginPath();
        ctx.moveTo(-20, -15);
        ctx.lineTo(-25, -18);
        ctx.lineTo(-25, -3);
        ctx.lineTo(-20, -6);
        ctx.moveTo(-20, 15);
        ctx.lineTo(-25, 18);
        ctx.lineTo(-25, 3);
        ctx.lineTo(-20, 6);
        ctx.fill();
        ctx.stroke();

        // left panel
        if (this.panelLeft) {
            ctx.translate(-12, -20);
            ctx.rotate(-15 * (Math.PI/180));
            ctx.fillStyle = "#0c2461";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(6, -8);
            ctx.moveTo(0, 0);
            ctx.lineTo(-6, -8);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(10, -8);
            ctx.lineTo(-10, -8);
            ctx.lineTo(-10, -20 * this.panelsExtension - 8);
            ctx.lineTo(10, -20 * this.panelsExtension - 8);
            ctx.lineTo(10, -8);
            ctx.moveTo(-10, -20 * this.panelsExtension - 8);
            ctx.lineTo(-10, -40 * this.panelsExtension - 8);
            ctx.lineTo(10, -40 * this.panelsExtension - 8);
            ctx.lineTo(10, -20 * this.panelsExtension - 8);
            ctx.moveTo(-10, -40 * this.panelsExtension - 8);
            ctx.lineTo(-10, -60 * this.panelsExtension - 8);
            ctx.lineTo(10, -60 * this.panelsExtension - 8);
            ctx.lineTo(10, -40 * this.panelsExtension - 8);
            ctx.moveTo(-10, -60 * this.panelsExtension - 8);
            ctx.lineTo(-10, -80 * this.panelsExtension - 8);
            ctx.lineTo(10, -80 * this.panelsExtension - 8);
            ctx.lineTo(10, -60 * this.panelsExtension - 8);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = "#ffffff55"
            ctx.beginPath();
            ctx.moveTo(-5, -80 * this.panelsExtension - 8);
            ctx.lineTo(-5, -8);
            ctx.moveTo(0, -80 * this.panelsExtension - 8);
            ctx.lineTo(0, -8);
            ctx.moveTo(5, -80 * this.panelsExtension - 8);
            ctx.lineTo(5, -8);
            ctx.stroke();
            ctx.rotate(15 * (Math.PI/180));
            ctx.translate(12, 20);
            ctx.strokeStyle = "#000000"
        }

        // right panel
        if (this.panelRight) {
            ctx.translate(-12, 20);
            ctx.rotate(-165 * (Math.PI/180));
            ctx.fillStyle = "#0c2461";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(6, -8);
            ctx.moveTo(0, 0);
            ctx.lineTo(-6, -8);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(10, -8);
            ctx.lineTo(-10, -8);
            ctx.lineTo(-10, -20 * this.panelsExtension - 8);
            ctx.lineTo(10, -20 * this.panelsExtension - 8);
            ctx.lineTo(10, -8);
            ctx.moveTo(-10, -20 * this.panelsExtension - 8);
            ctx.lineTo(-10, -40 * this.panelsExtension - 8);
            ctx.lineTo(10, -40 * this.panelsExtension - 8);
            ctx.lineTo(10, -20 * this.panelsExtension - 8);
            ctx.moveTo(-10, -40 * this.panelsExtension - 8);
            ctx.lineTo(-10, -60 * this.panelsExtension - 8);
            ctx.lineTo(10, -60 * this.panelsExtension - 8);
            ctx.lineTo(10, -40 * this.panelsExtension - 8);
            ctx.moveTo(-10, -60 * this.panelsExtension - 8);
            ctx.lineTo(-10, -80 * this.panelsExtension - 8);
            ctx.lineTo(10, -80 * this.panelsExtension - 8);
            ctx.lineTo(10, -60 * this.panelsExtension - 8);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = "#ffffff55"
            ctx.beginPath();
            ctx.moveTo(-5, -80 * this.panelsExtension - 8);
            ctx.lineTo(-5, -8);
            ctx.moveTo(0, -80 * this.panelsExtension - 8);
            ctx.lineTo(0, -8);
            ctx.moveTo(5, -80 * this.panelsExtension - 8);
            ctx.lineTo(5, -8);
            ctx.stroke();
            ctx.rotate(165 * (Math.PI/180));
            ctx.translate(12, -20);
        }
        
        // lasers
        if (this.laserOn) {
            ctx.fillStyle = "#4bcffa";
            ctx.strokeStyle = "#4bcffa";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(24, 19, 3, 4, 0, 0, Math.PI * 2);
            ctx.ellipse(24, -19, 3, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(24, 19);
            ctx.rotate(-this.angle);
            ctx.translate(-width/2, -height/2);
            ctx.lineTo(this.target.x, this.target.y);
            ctx.translate(width/2, height/2);
            ctx.rotate(this.angle);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(24, -19);
            ctx.rotate(-this.angle);
            ctx.translate(-width/2, -height/2);
            ctx.lineTo(this.target.x, this.target.y);
            ctx.ellipse(this.target.x, this.target.y, 2, 2, 0, 0, Math.PI * 2);
            ctx.translate(width/2, height/2);
            ctx.rotate(this.angle);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
        }
        
        ctx.strokeStyle = "#000000"
        ctx.rotate(-this.angle);
        ctx.translate(-width/2, -height/2);

        // hud
        // backdrop
        ctx.fillStyle = "#3c3c3c";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(65, -10);
        ctx.lineTo(65, 150);
        ctx.lineTo(-10, 200);
        ctx.lineTo(-10, -10);
        ctx.lineTo(65, -10);
        ctx.fill();
        ctx.stroke();


        // battery status
        ctx.translate(15, 20);

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(2, 2);
        ctx.lineTo(23, 2);
        ctx.lineTo(23, 48);
        ctx.lineTo(2, 48);
        ctx.lineTo(2, 2);
        ctx.moveTo(7, -1);
        ctx.lineTo(18, -1);
        ctx.stroke();            

        let displayColor;
        if (this.battery > 50) displayColor = "#ffd32a";
        else if (this.battery > 25) displayColor = "#ff9f1a";
        else if (this.battery > 0) displayColor = "#ff3838";
        else displayColor = "#aa0000";
        ctx.fillStyle = displayColor;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
    
        if (this.battery > 75) {
            ctx.beginPath();
            ctx.moveTo(7, 7);
            ctx.lineTo(18, 7);
            ctx.lineTo(18, 13);
            ctx.lineTo(7, 13);
            ctx.fill();
        }
        if (this.battery > 50) {
            ctx.beginPath();
            ctx.moveTo(7, 16);
            ctx.lineTo(18, 16);
            ctx.lineTo(18, 23);
            ctx.lineTo(7, 23);
            ctx.fill();
        }
        if (this.battery > 25) {
            ctx.beginPath();
            ctx.moveTo(7, 26);
            ctx.lineTo(18, 26);
            ctx.lineTo(18, 33);
            ctx.lineTo(7, 33);
            ctx.fill();
        }
        if (this.battery > 0) {
            ctx.beginPath();
            ctx.moveTo(7, 36);
            ctx.lineTo(18, 36);
            ctx.lineTo(18, 43);
            ctx.lineTo(7, 43);
            ctx.fill();
        }

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(30, 35);
        ctx.lineTo(20, 45);
        ctx.lineTo(30, 45);
        ctx.lineTo(20, 55);
        ctx.stroke();
        if (this.battery > 0) ctx.strokeStyle = "#ffd32a";
        else ctx.strokeStyle = "#aa0000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(30, 35);
        ctx.lineTo(20, 45);
        ctx.lineTo(30, 45);
        ctx.lineTo(20, 55);
        ctx.stroke();
    
        ctx.translate(-15, -20);

        // fuel status 
        ctx.translate(15, 100);
        
        ctx.fillStyle = "#05c46b";
        ctx.beginPath();
        ctx.moveTo(0, 40);
        ctx.lineTo(25, 40);
        ctx.lineTo(25, 40 - ((this.fuel/100) * 40));
        ctx.lineTo(0, 40 - ((this.fuel/100) * 40));
        ctx.lineTo(0, 40);
        ctx.fill();

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#000000"; 
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(25, 0);
        ctx.lineTo(25, 40);
        ctx.lineTo(28, 40);
        ctx.lineTo(28, 45);
        ctx.lineTo(-3, 45);
        ctx.lineTo(-3, 40);
        ctx.lineTo(0, 40);
        ctx.lineTo(0, 0);
        ctx.moveTo(-3, 40);
        ctx.lineTo(28, 40);
        ctx.stroke();

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(25, 15);
        ctx.lineTo(30, 15);
        ctx.lineTo(30, 35);
        ctx.lineTo(35, 35);
        ctx.lineTo(35, 10);
        ctx.lineTo(30, 5);
        ctx.stroke();

        ctx.fillStyle = "#3c3c3c";
        ctx.beginPath();
        ctx.moveTo(5, 5);
        ctx.lineTo(20, 5);
        ctx.lineTo(20, 20);
        ctx.lineTo(5, 20);
        ctx.lineTo(5, 5);
        ctx.fill();
        ctx.stroke();

        ctx.translate(-15, -100);

        if(!DEBUG) return;

        ctx.strokeStyle = "#ff0000";
        ctx.beginPath();
        ctx.moveTo(this.hitboxA.x, this.hitboxA.y);
        ctx.lineTo(this.hitboxB.x, this.hitboxB.y);
        ctx.lineTo(this.hitboxC.x, this.hitboxC.y);
        ctx.lineTo(this.hitboxD.x, this.hitboxD.y);
        ctx.lineTo(this.hitboxA.x, this.hitboxA.y);
        ctx.stroke(); 

        ctx.beginPath();
        ctx.moveTo(this.leftPanelHitboxA.x, this.leftPanelHitboxA.y);
        ctx.lineTo(this.leftPanelHitboxB.x, this.leftPanelHitboxB.y);
        ctx.lineTo(this.leftPanelHitboxC.x, this.leftPanelHitboxC.y);
        ctx.lineTo(this.leftPanelHitboxD.x, this.leftPanelHitboxD.y);
        ctx.lineTo(this.leftPanelHitboxA.x, this.leftPanelHitboxA.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.rightPanelHitboxA.x, this.rightPanelHitboxA.y);
        ctx.lineTo(this.rightPanelHitboxB.x, this.rightPanelHitboxB.y);
        ctx.lineTo(this.rightPanelHitboxC.x, this.rightPanelHitboxC.y);
        ctx.lineTo(this.rightPanelHitboxD.x, this.rightPanelHitboxD.y);
        ctx.lineTo(this.rightPanelHitboxA.x, this.rightPanelHitboxA.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(width/2, height/2, collisionRadius, collisionRadius, 0, 0, Math.PI * 2);
        ctx.stroke();

        rays.forEach((ray) => {
            let points = ray.getPoints();
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            points.forEach((pt) => {
                ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();
        });
    }
}