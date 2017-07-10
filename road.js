function Road() {
	this.verts = [
		[-5, 0, 0],
		[5, 0, 0],
		[5, 0, 100],
		[-5, 0, 100]
	];
}

Road.prototype.color = '#AAAAAA';

Road.prototype.edges = [];

Road.prototype.sides = [
	[0, 1, 2, 3]
];