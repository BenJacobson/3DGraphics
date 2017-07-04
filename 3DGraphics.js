let pm;
let xViewMin = -1, xViewMax = 1, yViewMin = -1, yViewMax = 1;
let velocity = 0;
let acceleration = 0;

function updateWindowSize(canvas) {
    pm = projectionMatrix(0, canvas.width, 0, canvas.height, 1, 100);
    let aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) {
        xViewMin = -1 * aspectRatio;
        xViewMax = 1 * aspectRatio;
        yViewMin = -1;
        yViewMax = 1;
    } else {
        xViewMin = -1;
        xViewMax = 1;
        yViewMin = -1 / aspectRatio;
        yViewMax = 1 / aspectRatio;
    }
}

function Cube(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.verts = [
        [x-1, y+1, z-1],
        [x+1, y+1, z-1],
        [x+1, y-1, z-1],
        [x-1, y-1, z-1],
        [x-1, y+1, z+1],
        [x+1, y+1, z+1],
        [x+1, y-1, z+1],
        [x-1, y-1, z+1]
    ];

    this.edges = [
        [0, 1],
        [0, 3],
        [0, 4],
        [1, 2],
        [1, 5],
        [2, 3],
        [2, 6],
        [3, 7],
        [4, 5],
        [4, 7],
        [5, 6],
        [6, 7]
    ];

    this.sides = [
        [4, 5, 6, 7],
        [0, 1, 5, 4],
        [2, 3, 7, 6],
        [0, 1, 2, 3],
        // [],
        // []
    ];

    this.colors = [
        '#00FFFF',
        '#FF0000',
        '#0000FF',
        '#00FF00'
    ]
};

Cube.prototype.show = function(canvas, context, cam) {
    context.strokeStyle = '#BBBBFF';

    let near = 2;

    points = this.verts.map(vert => {
        let [x, y, z] = vert;
        x -= cam.x;
        y -= cam.y;
        z -= cam.z;
        [x, z] = rotate(x, z, cam.roty);
        if (z < near)
            return null;
        x = near * x / z;
        y = near * y / z;

        if (x > xViewMax || x < xViewMin || y > yViewMax || y < yViewMin)
            return null;

        x += xViewMax;
        y += yViewMax;

        x *= canvas.width / (2 * xViewMax);
        y *= canvas.height / (2 * yViewMax);

        return [x, y];
    });

    if (points.some(p => p === null))
         return;

    for (let i = 0; i < this.sides.length; i++) {
        let side = this.sides[i];
        let [endx, endy] = points[side[side.length - 1]];
        context.fillStyle = '#111144'; // this.colors[i];
        context.beginPath();
        context.moveTo(endx, endy);
        side.forEach(pointi => {
            let [pointx, pointy] = points[pointi];
            context.lineTo(pointx, pointy);
        });
        context.fill();
    };

    this.edges.forEach(edge => {
        let p1 = points[edge[0]];
        let p2 = points[edge[1]];
        if (p1 == null || p2 == null)
            return
        let x1, y1, x2, y2;
        [x1, y1] = p1;
        [x2, y2] = p2;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    });
};

Cube.prototype.isCentered = function() {
    let x = this.x - cam.x;
    return -1 <= x && x <= 1;
}

var cam = {x: 0, y: -1.3, z: 0, rotx: 0, roty: 0};

function newRow() {
    let row = [];
    for (let i = -30; i <= 0; i += 2) {
        if (Math.random() < 0.2) {
            row.push(new Cube(cam.x + i, 0, cam.z + 100));
        }
        if (Math.random() < 0.2) {
            row.push(new Cube(cam.x - i, 0, cam.z + 100));
        }
    }
    return row;
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var keys = {}
var cubes = [new Cube(0, 0, 10), new Cube(0, 0, -10), new Cube(10, 0, 0), new Cube(-10, 0, 0)];

document.body.onkeydown = (event) => {
    keys[event.key] = true;
};

document.body.onkeyup = (event) => {
    keys[event.key] = false;
};

function addMovement() {
    if (keys['w']) {
        let x, z;
        z = Math.sin(cam.roty + Math.PI/2);
        x = -Math.cos(cam.roty + Math.PI/2);
        cam.x += x;
        cam.z += z
    }
    if (keys['s']) {
        let x, z;
        z = Math.sin(cam.roty + Math.PI/2);
        x = -Math.cos(cam.roty + Math.PI/2);
        cam.x -= x;
        cam.z -= z
    }
    if (keys['d']) {
        let x, z;
        z = -Math.sin(cam.roty);
        x = Math.cos(cam.roty);
        cam.x += x;
        cam.z += z
    }
    if (keys['a']) {
        let x, z;
        z = -Math.sin(cam.roty);
        x = Math.cos(cam.roty);
        cam.x -= x;
        cam.z -= z
    }
    if (keys['ArrowLeft']) {
        cam.roty -= 0.05;
    }
    if (keys['ArrowRight']) {
        cam.roty += 0.05;
    }
    if (keys['ArrowUp']) {
        cam.roty -= 0.05;
    }
    if (keys['ArrowDown']) {
        cam.roty += 0.05;
    }
    if (keys[' '] && cam.y == -1.3) {
        velocity = -1;
        acceleration = 0.1;
    }
    cam.y += velocity;
    velocity += acceleration
    if (cam.y > -1.3) {
        cam.y = -1.3;
        acceleration = velocity = 0;
    }
}

function rotate(x, y, rad) {
    s = Math.sin(rad);
    c = Math.cos(rad);
    return [x*c-y*s, y*c+x*s]
}

function render() {

    requestAnimationFrame(render);

    addMovement();

    // sky
    context.fillStyle = '#B0E2FF';
    context.fillRect(0, 0, canvas.width, canvas.height/2);

    // ground
    context.fillStyle = '#7D441D';
    context.fillRect(0, canvas.height/2, canvas.width, canvas.height);

    cubes.forEach(cube => {
        cube.show(canvas, context, cam);
    });
};

document.body.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateWindowSize(canvas);
};

window.onload = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateWindowSize(canvas);
    render();
}

// https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/opengl-perspective-projection-matrix
// http://www.codinglabs.net/article_world_view_projection_matrix.aspx
// http://www.songho.ca/opengl/gl_projectionmatrix.html
// http://relativity.net.au/gaming/java/depth.html
