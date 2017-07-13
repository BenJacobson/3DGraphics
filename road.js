function Road() {
	// this.verts = [
	// 	[-5, 0, -10],
	// 	[5, 0, -10],
	// 	[5, 0, -200],
	// 	[-5, 0, -200]
	// ];
	this.verts = [
		[-1000000, 0, -1000000],
		[ 1000000, 0, -1000000],
		[ 1000000, 0,  1000000],
		[-1000000, 0,  1000000]
	];
}

Road.prototype.color = '#AAAAAA';

Road.prototype.edges = [];

Road.prototype.sides = [
	[0, 1, 2, 3]
];