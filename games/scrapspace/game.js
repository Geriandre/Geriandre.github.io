const DEBUG = false;
const fuelRechargeAmount = 10;

const gameCanva = document.getElementById("gameCanva");
const context = gameCanva.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
let prevWidth = window.innerWidth;
let prevHeight = window.innerHeight;
gameCanva.width = width;
gameCanva.height = height;
let particles;
let rays;
let stars;
let scraps;
const nbScrap = 6000;
const cubeHealth = 20000;
let player;
let cube;
let scrapCount;
let mouseX;
let mouseY;
let restartCountDown = 300;
let subtitles = [];
let gameLaunched = false;
let cinematicDone = false;
let cinematicCount = -500;
let gameFrameCount = 0;
let globalFrameCount = 0;
const InitializeText = "initialisation du mode [Conscience-OS] ..."


// game loop
function gameLoop() {
    resize();

    context.clearRect(0, 0, width, height);

    if (gameLaunched) {
        if (!cinematicDone) {
            cinematic();

        } else {
            drawSpace();
            drawStars();
            updateScraps();
            drawScraps();
            updateRays();
            
            //cube update and draw
            cube.update();
            cube.draw(context);
            
            updateparticles();
            //player update and draw
            player.update();
            player.setTarget(new Vector(mouseX, mouseY));
            player.draw(context);
            miningCheck();
        
            restartInterface();
            if (gameFrameCount > 10 && gameFrameCount < 80) {
                blackScreen();
            }
            if (gameFrameCount > 90 && gameFrameCount < 100) {
                blackScreen();
            }
            if (gameFrameCount > 110 && gameFrameCount < 120) {
                blackScreen();
            }
            gameFrameCount++;
        }
    } else {
        blackScreen();
        context.fillStyle = "rgba(255, 255, 255, " + (Math.sin(globalFrameCount/100) * 0.5 + 0.5) + ")";
        context.font = "30px poppins";
        let str = "Espace pour lancer le jeu";
        context.fillText(str, width/2 - context.measureText(str).width/2, height/2);
    } 

    globalFrameCount++;
    requestAnimationFrame(gameLoop);
}

function blackScreen() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
}

function launchGame() {
    gameLaunched = true;
    generateSubtitles();
    start();
    gameLoop();
}

function cinematic() {
    blackScreen();

    subtitles.forEach((title) => {
        if (title.start <= cinematicCount && cinematicCount < title.end) {
            title.write(context);
        }
    });

    if (cinematicCount > 17000) {
        context.fillStyle = "#00ff00";
        context.font = "20px consolas";
        let str = InitializeText.slice(0, Math.min((cinematicCount - 17000) / 4, InitializeText.length))
        context.fillText(str, 10, 25);
    }
    if (cinematicCount > 17000 + InitializeText.length * 4) {
        let percent = "" + ~~Math.min((((cinematicCount - (17000 + InitializeText.length)) / 1000) * 100), 100) + "%";
        context.fillText(percent, 10, 50);
    }
    if (cinematicCount > 18500) {
        cinematicDone = true;
    }

    cinematicCount++;
}

function restartInterface() {
    if (player.alive) return;
    context.fillStyle = "rgba(0, 0, 0,  " + (1 - ((restartCountDown / 300))) + ")";
    context.fillRect(0, 0, width, height);
    if (restartCountDown > 0) restartCountDown--;
    else {
    }
    context.font = "20px consolas";
    context.fillStyle = "#00ff00";
    let str = "~ détruit ~ (Scrap collecté(s) -- " + scrapCount + ") ~ espace pour réessayer ~"
    str = str.slice(0, Math.min((300 - restartCountDown) / 4, str.length));
    context.fillText(str, 10, 25);
}

// start or restart
function start() {
    gameFrameCount = 0;
    restartCountDown = 300;
    particles = [];
    rays = [];
    scraps = [];
    stars = [];
    player = new Player();
    cube = new Cube(player.pos.x + width, player.pos.y);
    scrapCount = 0;
    generateStars();
    generateScraps();
}

// draw the space background
function drawSpace() {
    const gradient = context.createLinearGradient(0, 0, width/2, height/2);
    gradient.addColorStop(0, '#303040');
    gradient.addColorStop(1, '#000010');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
}

// draw stars in the background
function drawStars() {
    stars.forEach((star) => {
        star.draw(context);
    })
}

// generate stars on startup
function generateStars() {
    let nbStars = ~~(Math.random() * 190) + 10;
    for (let i = 0; i < nbStars; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        let size = (i % 2) + 1;
        stars.push(new Star(x, y, size));
    }
}

// update particle
function updateparticles() {
    particles.forEach((particle) => {
        particle.update();
        particle.draw(context);
    })
    particles = particles.filter((p) => p.lifetime > 0);
}

// update rays
function updateRays() {
    rays.forEach((ray) => {
        ray.update();
        ray.draw(context);
    })
    rays = rays.filter((r) => r.connected);
}

// mining check
function miningCheck() {
    if (!player.laserOn) return;
        if (Vector.dist(player.target, cube.pos) < cubeSize/2) {
            if (Math.random() > 0.98) particles.push(new Particle(player.target.x, player.target.y, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25, 10, 300, "#3c3c3c", "#000000"));
            if (Math.random() > 0.98) particles.push(new Particle(player.target.x, player.target.y, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25, 10, 300, "#d63031", "#000000"));
            cube.hp--;
            if (cube.hp <= 0) {
                scrapCount += cubeHealth;
                player.fuel += 100;
                for (let i = 0; i < 10; i++) {
                    particles.push(new Particle(cube.pos.x, cube.pos.y, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25, 10, 300, "#3c3c3c", "#000000"));
                }
            }
        }
    scraps.forEach((scrap) => {
        if (Vector.dist(player.target, scrap.pos) < scrap.size * 10) {
            scrap.hit();
            if (Math.random() > 0.95) particles.push(new Particle(scrap.pos.x, scrap.pos.y, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25, scrap.size * 10, 300, "#3c3c3c", "#000000"));
            if (scrap.mined) {
                scrapCount++;
                player.fuel += fuelRechargeAmount * scrap.size;
                for (let i = 0; i < 10; i++) {
                    particles.push(new Particle(scrap.pos.x, scrap.pos.y, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25, scrap.size * 10, 300, "#3c3c3c", "#000000"));
                }
                for (let i = 0; i < 5; i++) {
                    let xOff = Math.random() * (scrap.size*30) - (scrap.size*15);
                    let yOff = Math.random() * (scrap.size*30) - (scrap.size*15);
                    let off = new Vector(xOff, yOff);
                    off.add(scrap.pos);
                    let dir = Vector.sub(player.pos, off);
                    dir.setMag(5);
                    let lifeTime = Vector.dist(player.pos, off) / 5;
                    particles.push(new Particle(off.x, off.y, dir.x, dir.y, 5, lifeTime, "#05c46b", "#05c46b"));
                }
            }
        }
    }) 
}

// update scrap
function updateScraps() {
    scraps.forEach((scrap) => {
        scrap.update();
    })
    scraps = scraps.filter((s) => !s.mined);
}

// draw scrap pieces
function drawScraps() {
    scraps.forEach((scrap) => {
        scrap.draw(context);
    })
}

// generate scraps
function generateScraps() {
    for (let i = 0; i < nbScrap; i++) {
        let x = -(Math.random() * width * 20) + width * 10;
        let y = (Math.random() * width * 20) - width * 10;
        let type = ~~(Math.random() * 3);
        if (type == 0) scraps.push(new AfricScrap(x, y));
        if (type == 1) scraps.push(new SquareScrap(x, y));
        if (type == 2) scraps.push(new UScrap(x, y));
    }

    scraps = scraps.filter((s) => (Vector.dist(s.pos, player.pos) > collisionRadius * 2));
}

// generate subtitles
function generateSubtitles() {
    subtitles.push(new Subtitle(1, 6, "#0984e3", "On y est presque, arrivé sur place d'ici 30 secondes"));
    subtitles.push(new Subtitle(7, 15, "#00b894", "Aller, au boulot, on va nettoyer ce secteur en deux temps trois mouvements avec la nouvelle version des Bot-Net"));
    subtitles.push(new Subtitle(16, 22, "#fdcb6e", "Vous saviez d'ailleurs qu'apparemment ils ont un mode \"Conscience\" qui s'active en cas de danger ?"));
    subtitles.push(new Subtitle(23, 27, "#00b894", "Oui bien sur, haha ! Ils ont même un mode vaisselle quand tu la fait pas !"));
    subtitles.push(new Subtitle(27, 30, "#fdcb6e", "Pffff, t'as même pas lu le manuel..."));
    subtitles.push(new Subtitle(31, 37, "#0984e3", "Les gars on y est, le secteur 4546B, larguez moi un Bot-Net en reconnaissance"));
    subtitles.push(new Subtitle(37, 40, "#fdcb6e", "C'est parti ! J'envoie le 3"));
    subtitles.push(new Subtitle(45, 50, "#00b894", "Attendez, c'est quoi ça sur l'écran ?"));
    subtitles.push(new Subtitle(50, 52, "#0984e3", "De quoi ?"));
    subtitles.push(new Subtitle(52, 55, "#00b894", "Le point rouge là"));
    subtitles.push(new Subtitle(56, 62, "#fdcb6e", "MERDE ! C'est un noyau d'énergie dépourvu de controlleur ! Il va nous avaler !"));
    subtitles.push(new Subtitle(62, 67, "#0984e3", "Reçu on décampe, pas le temps de ramener le 3, on se tire !"));
    subtitles.push(new Subtitle(67, 70, "#0984e3", "Passage dans l'hyperspace iminent..."));
    subtitles.push(new Subtitle(70, 71, "#0984e3", "2"));
    subtitles.push(new Subtitle(71, 72, "#0984e3", "1"));
    subtitles.push(new Subtitle(75, 80, "#ffffff", "..."));
    // subtitles.push(new Subtitle(0, 0, "", ""));
}

// debug if DEBUG == true
function debug(obj) {
    if (DEBUG) console.log(obj);
}

// resize
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    let xDif = (prevWidth - width) / 2;
    let yDif = (prevHeight - height) / 2;
    if (Math.abs(xDif) > 0 || Math.abs(yDif) > 0) {
        let dif = new Vector(xDif, yDif);
        if (gameLaunched) {
            scraps.forEach((scrap) => {
                scrap.pos.sub(dif);
            });
            particles.forEach((particle) => {
                particle.pos.sub(dif);
            });
        }
        gameCanva.width = width;
        gameCanva.height = height;
    }

    prevWidth = width;
    prevHeight = height;
}

function handleMouseMove(event) {
    let rect = gameCanva.getBoundingClientRect();
    scaleX = gameCanva.width / rect.width;
    scaleY = gameCanva.height / rect.height;
    mouseX = (event.clientX - rect.left) * scaleX;
    mouseY = (event.clientY - rect.top) * scaleY;
}

document.onmousemove = handleMouseMove;

window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        if (!gameLaunched) {
            launchGame();
            return;
        }
        player.togglePanels();
        if (restartCountDown < 300) start();
    }
    if (event.code === "KeyW") player.thrusterOn = true;
});

window.addEventListener("keyup", (event) => {
    if (!gameLaunched) return;
    if (event.code === "KeyW") player.thrusterOn = false;
});

window.addEventListener("mousedown", (event) => {
    if (!gameLaunched) return;
    if (event.button === 0) player.toggleLaser(true);
});

window.addEventListener("mouseup", (event) => {
    if (!gameLaunched) return;
    if (event.button === 0) player.toggleLaser(false);
});

gameLoop();