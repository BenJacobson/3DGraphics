let pm;

function updateWindowSize(canvas) {
    pm = projectionMatrix(0, canvas.width, 0, canvas.height, 1, 100);
}

function Cube(x, y, z) {
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
        [x, z] = rotate(x, z, cam.rotx);
        if (z < near)
            return null;
        x = near * x / z;
        y = near * y / z;

        if (x > 1 || x < -1 || y > 1 || y < -1)
            return null;

        x += 1;
        y += 1;

        x *= canvas.width / 2;
        y *= canvas.height / 2;

        return [x, y];
    });

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

    for (let i = 0; i < this.sides.length; i++) {
        let side = this.sides[i];
        if (side.some(pi => points[pi] === null))
            continue;
        let [endx, endy] = points[side[side.length - 1]];
        context.fillStyle = this.colors[i];
        context.beginPath();
        context.moveTo(endx, endy);
        side.forEach(pointi => {
            let [pointx, pointy] = points[pointi];
            context.lineTo(pointx, pointy);
        });
        context.fill();
    };
};

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var cam = {x: 0, y: -1, z: 0, rotx: 0, roty: 0};
var keys = {}
var cubes = [new Cube(0, 0, 5), new Cube(5, 5, 5)];

document.body.onkeydown = (event) => {
    keys[event.key] = true;
};

document.body.onkeyup = (event) => {
    keys[event.key] = false;
};

function addMovement() {
    if (keys['w']) {
        cam.z += 0.15;
    }
    if (keys['s']) {
        cam.z -= 0.15;
    }
    if (keys['d']) {
        let x, z;
        [x, z] = rotate(0.2, 0, cam.rotx);
        console.log(x, z);
        cam.x += x;
        cam.z += z
    }
    if (keys['a']) {
        let x, z;
        [x, z] = rotate(0.2, 0, cam.rotx);
        console.log(x, z);
        cam.x -= x;
        cam.z -= z
    }
    if (keys['q']) {
        cam.rotx += 0.05;
    }
    if (keys['e']) {
        cam.rotx -= 0.05;
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

    // background
    context.fillStyle = '#333344';
    context.fillRect(0, 0, canvas.width, canvas.height);

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
