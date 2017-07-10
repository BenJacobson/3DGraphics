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

    this.color = '#111144';
};

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
    // [],
    // []
];