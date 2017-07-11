let projector = new Projector(10, 10, 1, 10);

let p = [0, -10, -5];

projector.frustrumPlanes.forEach((plane, i) => console.log(i, plane.isInside(p)));
