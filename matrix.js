function projectionMatrix(left, right, top, bottom, near, far) {
    let pm = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    pm[0][0] = 2 * near / (right - left);
    pm[0][2] = (right + left) / (right - left);
    pm[1][1] = 2 * near / (top - bottom);
    pm[1][2] = (top + bottom) / (top - bottom);
    pm[2][2] = -(far + near) / (far - near);
    pm[2][3] = -2 * far * near / (far - near);
    pm[3][2] = -1;
    return pm;
}

function mmultiply(a, b) {
    let aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
    for (let r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (let c = 0; c < bNumCols; ++c) {
            m[r][c] = 0;             // initialize the current cell
            for (let i = 0; i < aNumCols; ++i) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
}