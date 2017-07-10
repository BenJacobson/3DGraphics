function Projector(width, height, near, far) {
    this.updateAspect(width, height);
    this.near = near;
    this.far = far;
    this.frustrumPlanes = [];
}

Projector.prototype.updateAspect = function(width, height) {
    this.width = width;
    this.height = height;
    let aspectRatio = width / height;
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
}

Projector.prototype.project = function(vec) {
        let [x, y, z] = vec;

        // if (z < this.near || z > this.far)
        //     return null;

        x = this.near * x / z;
        y = this.near * y / z;

        // if (x > this.xViewMax || x < this.xViewMin || y > this.yViewMax || y < this.yViewMin)
        //     return null;

        x += this.xViewMax;
        y += this.yViewMax;

        x *= this.width / (2 * this.xViewMax);
        y *= this.height / (2 * this.yViewMax);

        return [x, y]
}
