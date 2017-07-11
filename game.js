function Game() {
    this.canvas = document.createElement('canvas');
    document.body.append(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.keysPressed = {};
    this.cam = new Camara();
    let near = 2;
    let far = 250;
    this.projector = new Projector(0, 0, near, far);
    this.velocity = 0;
    this.acceleration = 0;

    this.models = [new Road()]; // , new Cube(0, -1, 10), new Cube(10, -1, 0), new Cube(-10, -1, 0)];

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

Game.prototype.show = function(model) {
    this.context.strokeStyle = '#BBBBFF';

    let points = model.verts.map(worldVert => {
        let viewVert = this.cam.lookAt(worldVert);
        let projectedVert = this.projector.project(viewVert)
        return projectedVert;
    });

    if (points.some(p => p === null))
         return;

    for (let i = 0; i < model.sides.length; i++) {
        let side = model.sides[i];
        let [endx, endy] = points[side[side.length - 1]];
        this.context.fillStyle = model.color;
        this.context.beginPath();
        this.context.moveTo(endx, endy);
        side.forEach(pointi => {
            let [pointx, pointy] = points[pointi];
            this.context.lineTo(pointx, pointy);
        });
        this.context.fill();
    };

    model.edges.forEach(edge => {
        let [x1, y1] = points[edge[0]];
        let [x2, y2] = points[edge[1]];
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    });
};

Game.prototype.clipShow = function(model) {

    let viewVerts = model.verts.map(worldVert => {
        return this.cam.lookAt(worldVert);
    });

    let viewSides = model.sides.map(side => {
        return side.map(i => viewVerts[i]);
    });

    let projectedSides = viewSides.map(viewSide => {
        return this.projector.project(viewSide);
    });

    this.context.fillStyle = model.color;
    projectedSides.forEach(side => {
        let [endx, endy] = side[side.length - 1];
        this.context.beginPath();
        this.context.moveTo(endx, endy);
        side.forEach(vert => {
            let [vertx, verty] = vert;
            this.context.lineTo(vertx, verty);
        });
        this.context.fill();
    });
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

    this.models.forEach(this.clipShow.bind(this));
};

new Game();

// https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/opengl-perspective-projection-matrix
// http://www.codinglabs.net/article_world_view_projection_matrix.aspx
// http://www.songho.ca/opengl/gl_projectionmatrix.html
// http://relativity.net.au/gaming/java/depth.html
