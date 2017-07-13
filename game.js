function Game() {
    this.canvas = document.createElement('canvas');
    document.body.append(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.fpsElement = this.createFpsElement();
    document.body.append(this.fpsElement);
    this.xyzElement = this.createXyzElement();
    document.body.append(this.xyzElement);
    this.keysPressed = {};
    this.cam = new Camara();
    let near = 2;
    let far = 250;
    this.projector = new Projector(0, 0, near, far);
    this.velocity = 0;
    this.acceleration = 0;
    this.lastFrameTime = Date.now();
    this.frameCount = 0;
    this.frameRate = 0;

    this.models = [];

    for (let i = 0; i < 1000; i++) {
        let x = Math.floor(Math.random() * 2000) - 1000;
        let z = Math.floor(Math.random() * 2000) - 1000;
        this.models.push(new Cube(x, -1, z));
    }

    document.body.onkeydown = (event) => {
        this.keysPressed[event.key] = true;
    };

    document.body.onkeyup = (event) => {
        this.keysPressed[event.key] = false;
    };

    document.body.onresize = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.projector.reset(this.canvas.width, this.canvas.height, near, far);
    };

    window.onload = () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.projector.reset(this.canvas.width, this.canvas.height, near, far);
        this.render();
    }
}

Game.prototype.createXyzElement = function() {
    let xyxElement = document.createElement('div');
    xyxElement.style.position = 'absolute';
    xyxElement.style.top = 10;
    xyxElement.style.left = 10;
    return xyxElement;
};

Game.prototype.createFpsElement = function() {
    let fpsElement = document.createElement('div');
    fpsElement.style.position = 'absolute';
    fpsElement.style.top = 10;
    fpsElement.style.right = 10;
    return fpsElement;
};

Game.prototype.tick = function() {
    if (this.keysPressed['w']) {
        this.cam.moveForward();
    }
    if (this.keysPressed['s']) {
        this.cam.moveBackward();
    }
    if (this.keysPressed['d']) {
        this.cam.moveRight();
    }
    if (this.keysPressed['a']) {
        this.cam.moveLeft();
    }
    if (this.keysPressed['ArrowLeft']) {
        this.cam.rotateLeft();
    }
    if (this.keysPressed['ArrowRight']) {
        this.cam.rotateRight();
    }
    if (this.keysPressed['ArrowUp']) {
        
    }
    if (this.keysPressed['ArrowDown']) {
        
    }
    
    if (this.keysPressed[' '] && this.cam.y == -1.3) {
        this.velocity = -1;
        this.acceleration = 0.1;
    }
    this.cam.y += this.velocity;
    this.velocity += this.acceleration
    if (this.cam.y > -1.3) {
        this.cam.y = -1.3;
        this.acceleration = this.velocity = 0;
    }
}

Game.prototype.calcFrameRate = function() {
    this.frameCount++;
    let now = Date.now();
    if (now - this.lastFrameTime >= 1000) {
        this.frameRate = this.frameCount;
        this.lastFrameTime = now;
        this.frameCount = 0;
    }
    return this.frameRate;
};
 
Game.prototype.render = function() {

    requestAnimationFrame(this.render.bind(this));

    this.tick();

    // sky
    this.context.fillStyle = '#B0E2FF';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height/2);

    // ground
    this.context.fillStyle = '#7D441D';
    this.context.fillRect(0, this.canvas.height/2, this.canvas.width, this.canvas.height);

    let faces2D = this.models.map(model => model.faces);
    let flatFaces = Array.prototype.concat.apply([], faces2D);
    flatFaces.forEach(face => face.view(this.cam));
    flatFaces.forEach(face => face.clip(Clipper, this.projector.frustrumPlanes));
    let facesToShow = flatFaces.filter(face => face.viewFace.length > 0);
    facesToShow.sort((a, b) => b.viewDistance() - a.viewDistance());
    facesToShow.forEach(face => face.project(this.projector));
    facesToShow.forEach(face => face.show(this.context));


    this.fpsElement.innerText = this.calcFrameRate() + ' FPS';
    this.xyzElement.innerText = `X:${Math.round(this.cam.x)} Y:${Math.round(this.cam.y)} Z:${Math.round(this.cam.z)}`;
};

new Game();
