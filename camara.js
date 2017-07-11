function Camara() {
	this.x = 0;
	this.y = -2.3;
	this.z = 0;
	this.rotx = 0;
	this.roty = 0;
	this.piHalf = Math.PI / 2;
}

Camara.prototype.moveForward = function() {
	let x, z;
	z = Math.sin(this.rotx + this.piHalf);
	x = -Math.cos(this.rotx + this.piHalf);
	this.x -= x;
	this.z -= z;
}

Camara.prototype.moveBackward = function() {
    let x, z;
    z = Math.sin(this.rotx + this.piHalf);
    x = -Math.cos(this.rotx + this.piHalf);
    this.x += x;
    this.z += z;
}

Camara.prototype.moveLeft = function() {
    let x, z;
    z = -Math.sin(this.rotx);
    x = Math.cos(this.rotx);
    this.x -= x;
    this.z -= z;
}

Camara.prototype.moveRight = function() {
    let x, z;
    z = -Math.sin(this.rotx);
    x = Math.cos(this.rotx);
    this.x += x;
    this.z += z;
}

Camara.prototype.rotate = function(a, b, rad) {
    s = Math.sin(rad);
    c = Math.cos(rad);
    return [a*c-b*s, b*c+a*s]
}

Camara.prototype.rotateLeft = function() {
	this.rotx += 0.02;
}

Camara.prototype.rotateRight = function() {
	this.rotx -= 0.02;
}

Camara.prototype.lookAt = function(vec) {
	let [x, y, z] = vec;
	x -= this.x;
	y -= this.y;
	z -= this.z;
	[x, z] = this.rotate(x, z, this.rotx);
	return [x, y, z];
}
