function Clipper() {}

Clipper.prototype.clip = function(polygonPoints, planes) {
    console.log(polygonPoints.map(polyp => planes.every(plane => plane.isInside(polyp))));
    return polygonPoints;
}

Clipper = new Clipper();
