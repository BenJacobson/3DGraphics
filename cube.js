function Cube(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.worldVerts = this.verts.map(v => [v[0]+x, v[1]+y, v[2]+z]);
};

Cube.prototype.colors = [
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#00FFFF',
    '#FF00FF'
];

Cube.prototype.verts = [
    [-1, +1, -1],
    [+1, +1, -1],
    [+1, -1, -1],
    [-1, -1, -1],
    [-1, +1, +1],
    [+1, +1, +1],
    [+1, -1, +1],
    [-1, -1, +1]
];

Cube.prototype.edges = [
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

Cube.prototype.sides = [
    [4, 5, 6, 7],
    [0, 1, 5, 4],
    [2, 3, 7, 6],
    [0, 1, 2, 3],
    [1, 2, 6, 5],
    [3, 0, 4, 7]
]

Cube.prototype.getFaces = function(cam) {
    let viewVerts = this.worldVerts.map(vert => {
        return cam.lookAt(vert);
    });
    return this.sides.map((side, i) => {
        return new Polygon(side.map(s => viewVerts[s]), this.colors[i]);
    });
};
