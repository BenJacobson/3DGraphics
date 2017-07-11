/*
	Points must be passed in counter-clockwise order
	from the point of view of "inside the plane"
	for normal to point to the inside of the plane
*/
function Plane(p1, p2, p3) {
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	let [x1, y1, z1] = this.p1;
	let [x2, y2, z2] = this.p2;
	let [x3, y3, z3] = this.p3;
	this.v1 = [x2-x1, y2-y1, z2-z1];
	this.v2 = [x3-x1, y3-y1, z3-z1];
	let [a1, a2, a3] = this.v1;
	let [b1, b2, b3] = this.v2;
	this.normal = [
		a2*b3 - a3*b2,
		a3*b1 - a1*b3,
		a1*b2 - a2*b1,
	];
}

Plane.prototype.distance = function(vert) {
	let dx = vert[0] - this.p1[0];
	let dy = vert[1] - this.p1[1];
	let dz = vert[2] - this.p1[2];
	// dot product with normal
	return dx*this.normal[0] + dy*this.normal[1] + dz*this.normal[2];
}

Plane.prototype.isInside = function(vert) {
	let d = this.distance(vert);
	return d > 0;
}

Plane.prototype.intersection = function(x1, y1, z1, x2, y2, z2) {

}
