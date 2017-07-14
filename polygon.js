function Polygon(viewFace, color) {
	this.viewFace = viewFace;
	this.clipFace = [];
	this.projectedFace = [];
	this.color = color;
};

Polygon.prototype.clipDistance = function() {
	if (!this.clipDistanceCache) {
		this.clipDistanceCache = this.clipFace.length != 0 ?
		    this.clipFace.reduce((vSum, vert) => {
		        return vSum + (vert.reduce((cSum, coord) => {
		            return cSum + (coord * coord);
		        }, 0) / vert.length);
		    }, 0) / this.clipFace.length :
		    0;
	}
	return this.clipDistanceCache;
};

Polygon.prototype.clip = function(clipper, planes) {
	this.clipFace = clipper.clip(this.viewFace, planes);
	this.clipDistanceCache = undefined;
};

Polygon.prototype.project = function(projector) {
	this.projectedFace = projector.project(this.clipFace);
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