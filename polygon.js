function Polygon(face, color) {
	this.face = face;
	this.viewFace = [];
	this.projectedFace = [];
	this.color = color;
};

Polygon.prototype.view = function(cam) {
	this.viewFace = this.face.map(vert => cam.lookAt(vert));
}

Polygon.prototype.viewDistance = function() {
	if (this.viewFace.length == 0) return 0;
    let d = this.viewFace.reduce((vSum, vert) => {
        return vSum + (vert.reduce((cSum, coord) => {
            return cSum + (coord * coord);
        }, 0) / vert.length);
    }, 0) / this.viewFace.length;
    return d;
};

Polygon.prototype.project = function(projector) {
	this.projectedFace = projector.project(this.viewFace);
};

Polygon.prototype.show = function(context) {
    if (this.projectedFace.length == 0) // completly off-screen
        return;
    context.fillStyle = this.color; // '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    let [endx, endy] = this.projectedFace[this.projectedFace.length - 1];
    context.beginPath();
    context.moveTo(endx, endy);
    this.projectedFace.forEach(vert => {
        let [vertx, verty] = vert;
        context.lineTo(vertx, verty);
    });
    context.fill();
}