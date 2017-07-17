function Kart() {
    this.color = '#FF0000';
    this.wheels = [
        new Wheel(1.2, 1, -13, 0.5,  30),
        new Wheel(-1.2, 1, -13, 0.5,  30),
        new Wheel(1.2, 1, -11, 0.5,  30),
        new Wheel(-1.2, 1, -11, 0.5,  30)
    ];
}

Kart.prototype.getFaces = function(cam) {
    let viewVerts = this.verts.map(vert => {
        return cam.lookAt(vert);
    });
    return Array.prototype.concat.apply(this.sides.map(side => {
        return new Polygon(side.map(s => viewVerts[s]), this.color);
    }), this.wheels.map(wheel => wheel.getFaces(cam)));
}
  
Kart.prototype.verts = [
    [-1, +1, -14],
    [+1, +1, -14],
    [+1,  0, -14],
    [-1,  0, -14],
    [-1, +1, -10],
    [+1, +1, -10],
    [+1,  0, -10],
    [-1,  0, -10]
];


Kart.prototype.sides = [
    [4, 5, 6, 7],
    [0, 1, 5, 4],
    [2, 3, 7, 6],
    [0, 1, 2, 3],
    [1, 2, 6, 5],
    [3, 0, 4, 7]
]

function Wheel(x, y, z, scale, precision) {
	this.circle = [];
	let twoPI = Math.PI * 2;
	let inc = twoPI / precision;
	for (let r = 0, i = 0; r < twoPI; r += inc, i++) {
		this.circle.push([x, y+(Math.cos(r)*scale), z+(Math.sin(r)*scale)]);
	}
	this.color1 = '#000000';
	this.color2 = '#FFFF00';
	this.width = 0.5 * scale;

    let identity = v => v;
    this.sides = [];
    let side1 = [];
    let side2 = [];

    // top / bottom of wheels
    for (let i = 0; i < this.circle.length; i++) {
    	let j = (i+1) % this.circle.length;
    	let first = this.circle[i].map(identity);
    	first[0] -= this.width;
    	side1.push(first);
    	let second = this.circle[j].map(identity);
    	second[0] -= this.width;
    	let third = this.circle[j].map(identity);
    	third[0] += this.width;
    	let fourth = this.circle[i].map(identity);
    	fourth[0] += this.width;
    	side2.push(fourth);
    	let verts = [
    		first,
    		second,
    		third,
    		fourth
    	];
    	this.sides.push(verts);
    }
    this.sides.push(side1);
    this.sides.push(side2);
};

Wheel.prototype.getFaces = function(cam) {
    return this.sides.map(side => new Polygon(side.map(vert => cam.lookAt(vert)), this.color1));
};