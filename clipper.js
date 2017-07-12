function Clipper() {}

Clipper.prototype.clip = function(polygonVerts, planes) {
    let output = polygonVerts;
    planes.forEach(plane => {
        let input = output;
        output = [];
        let startPoint = input[input.length - 1];
        input.forEach(endPoint =>{
            let startPointInside = plane.isInside(startPoint);
            let endPointInside = plane.isInside(endPoint);
            if (startPointInside && endPointInside) {
                output.push(endPoint);
            } else if (startPointInside && !endPointInside) {
                output.push(plane.intersection(startPoint, endPoint));
            } else if (!startPointInside && endPointInside) {
                output.push(plane.intersection(startPoint, endPoint));
                output.push(endPoint);
            }
            startPoint = endPoint;
        });
    });
    return output
}

Clipper = new Clipper();
