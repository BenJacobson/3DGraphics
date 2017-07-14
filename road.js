function Road() {
	this.verts = [
		[-5, 0, -10],
		[5, 0, -10],
		[5, 0, -200],
		[-5, 0, -200]
	];
}

Road.prototype.color = '#AAAAAA';

Road.prototype.edges = [];

Road.prototype.sides = [
	[0, 1, 2, 3]
];

Road.prototype.getFaces = function(cam) {
    let viewVerts = this.verts.map(vert => {
        return cam.lookAt(vert);
    });
    return this.sides.map(side => {
        return new Polygon(side.map(s => viewVerts[s]), this.color);
    });
};
