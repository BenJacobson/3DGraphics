function Wheel(precision) {
	this.circle = [];
	let twoPI = Math.PI * 2;
	let inc = twoPI / precision;
	for (let r = 0, i = 0; r < twoPI; r += inc, i++) {
		this.circle.push([Math.cos(r), Math.sin(r), 0]);
	}
	this.color1 = '#000000';
	this.color2 = '#FFFF00';
	this.width = 1;

    let identity = v => v;
    this.sides = [];
    let side1 = [];
    let side2 = [];

    // top / bottom of wheels
    for (let i = 0; i < this.circle.length; i++) {
    	let j = (i+1) % this.circle.length;
    	let first = this.circle[i].map(identity);
    	first[2] -= this.width;
    	side1.push(first);
    	let second = this.circle[j].map(identity);
    	second[2] -= this.width;
    	let third = this.circle[j].map(identity);
    	third[2] += this.width;
    	let fourth = this.circle[i].map(identity);
    	fourth[2] += this.width;
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