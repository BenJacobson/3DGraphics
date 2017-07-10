function Clipper() {}

// Returns x-value of point of intersectipn of two
// lines
Clipper.prototype.x_intersect = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    let num = (x1*y2 - y1*x2) * (x3-x4) -
              (x1-x2) * (x3*y4 - y3*x4);
    let den = (x1-x2) * (y3-y4) - (y1-y2) * (x3-x4);
    return num/den;
}
 
// Returns y-value of point of intersectipn of
// two lines
Clipper.prototype.y_intersect = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    let num = (x1*y2 - y1*x2) * (y3-y4) -
              (y1-y2) * (x3*y4 - y3*x4);
    let den = (x1-x2) * (y3-y4) - (y1-y2) * (x3-x4);
    return num/den;
}
 
// This functions clips all the edges w.r.t one clip
// edge of clipping area
Clipper.prototype.clip = function(poly_points, x1, y1, x2, y2) {
    let poly_size = poly_points.length;
    let new_points = [];
    let new_poly_size = 0;
 
    // (ix,iy),(kx,ky) are the co-ordinate values of
    // the points
    for (let i = 0; i < poly_size; i++) {
        // i and k form a line in polygon
        let k = (i+1) % poly_size;
        let ix = poly_points[i][0], iy = poly_points[i][1];
        let kx = poly_points[k][0], ky = poly_points[k][1];
 
        // Calculating position of first point
        // w.r.t. clipper line
        let i_pos = (x2-x1) * (iy-y1) - (y2-y1) * (ix-x1);
 
        // Calculating position of second point
        // w.r.t. clipper line
        let k_pos = (x2-x1) * (ky-y1) - (y2-y1) * (kx-x1);
 
        // Case 1 : When both points are inside
        if (i_pos < 0  && k_pos < 0) {
            //Only second point is added
            new_points[new_poly_size][0] = kx;
            new_points[new_poly_size][1] = ky;
            new_poly_size++;
        }
 
        // Case 2: When only first point is outside
        else if (i_pos >= 0  && k_pos < 0) {
            // Point of intersection with edge
            // and the second point is added
            new_points[new_poly_size][0] = x_intersect(x1,
                              y1, x2, y2, ix, iy, kx, ky);
            new_points[new_poly_size][1] = y_intersect(x1,
                              y1, x2, y2, ix, iy, kx, ky);
            new_poly_size++;
 
            new_points[new_poly_size][0] = kx;
            new_points[new_poly_size][1] = ky;
            new_poly_size++;
        }
 
        // Case 3: When only second point is outside
        else if (i_pos < 0  && k_pos >= 0) {
            //Only point of intersection with edge is added
            new_points[new_poly_size][0] = x_intersect(x1,
                              y1, x2, y2, ix, iy, kx, ky);
            new_points[new_poly_size][1] = y_intersect(x1,
                              y1, x2, y2, ix, iy, kx, ky);
            new_poly_size++;
        }
 
        // Case 4: When both points are outside
        else {
            //No points are added
        }
    }
 
    return new_points;
}
 
// Implements Sutherland–Hodgman algorithm
Clipper.prototype.suthHodgClip = function(poly_points, clipper_points) {
    let poly_size = poly_points.length;
    let clipper_size = clipper_points.length;
    //i and k are two consecutive indexes
    for (let i=0; i<clipper_size; i++) {
        let k = (i+1) % clipper_size;
 
        // We pass the current array of vertices, it's size
        // and the end points of the selected clipper line
        poly_points = clip(poly_points, clipper_points[i][0],
             clipper_points[i][1], clipper_points[k][0],
             clipper_points[k][1]);
    }
 
    return poly_points;
}

Clipper = new Clipper();
