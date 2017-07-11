function Projector(width, height, near, far) {
    this.reset(width, height, near, far);
}

Projector.prototype.reset = function(width, height, near, far) {
    this.width = width;
    this.height = height;
    this.near = near;
    this.far = far;
    this._updateAspect();
    this._initFrustrumPlanes();
}

Projector.prototype._updateAspect = function() {
    let aspectRatio = this.width / this.height;
    if (aspectRatio > 1) {
        this.xViewMin = -1 * aspectRatio;
        this.xViewMax = 1 * aspectRatio;
        this.yViewMin = -1;
        this.yViewMax = 1;
    } else {
        this.xViewMin = -1;
        this.xViewMax = 1;
        this.yViewMin = -1 / aspectRatio;
        this.yViewMax = 1 / aspectRatio;
    }
    this.farXViewMin = this.xViewMin * this.far / this.near;
    this.farXViewMax = this.xViewMax * this.far / this.near;
    this.farYViewMin = this.yViewMin * this.far / this.near;
    this.farYViewMax = this.yViewMax * this.far / this.near;
}

Projector.prototype._initFrustrumPlanes = function() {
    // points of the frustrum
    let nearTopLeft = [this.xViewMin, this.yViewMax, -this.near];
    let nearTopRight = [this.xViewMax, this.yViewMax, -this.near];
    let nearBottomLeft = [this.xViewMin, this.yViewMin, -this.near];
    let nearBottomRight = [this.xViewMax, this.yViewMin, -this.near];
    let farTopLeft = [this.farXViewMin, this.farYViewMax, -this.far];
    let farTopRight = [this.farXViewMax, this.farYViewMax, -this.far];
    let farBottomLeft = [this.farXViewMin, this.farYViewMin, -this.far];
    let farBottomRight = [this.farXViewMax, this.farYViewMin, -this.far];
    // planes
    let nearPlane   = new Plane(nearTopLeft, nearTopRight, nearBottomRight);
    let leftPlane   = new Plane(farTopLeft, nearTopLeft, nearBottomLeft);
    let rightPlane  = new Plane(nearTopRight, farTopRight, farBottomRight);
    let topPlane    = new Plane(nearTopRight, nearTopLeft, farTopLeft);
    let bottomPlane = new Plane(farBottomRight, farBottomLeft, nearBottomLeft);
    let farPlane    = new Plane(farTopRight, farTopLeft, farBottomLeft);
    // set planes
    this.frustrumPlanes = [
        nearPlane,
        leftPlane,
        rightPlane,
        topPlane,
        bottomPlane,
        farPlane
    ];
}

Projector.prototype._projectPoint = function(vert) {
    let [x, y, z] = vert;

    let px = this.near * x / -z;
    let py = this.near * y / -z;

    px += this.xViewMax;
    py += this.yViewMax;

    px *= this.width / (2 * this.xViewMax);
    py *= this.height / (2 * this.yViewMax);

    return [px, py];
}

Projector.prototype.project = function(polygon) {
        let clippedVerts = Clipper.clip(polygon, this.frustrumPlanes); // do clipping here
        return clippedVerts.map(this._projectPoint.bind(this));
}
