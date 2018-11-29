function setup() {
    createCanvas(400, 400);
    background(0);
}

function drawLine(xs, ys) {
    let px = undefined;
    let py = undefined;
    strokeWeight(2);
    for (let i = 0; i < xs.length; i++) {
        let x = map(xs[i], 0, 1, 0, width);
        let y = map(ys[i], 0, 1, 0, height);

        if (px != undefined) {
            line(x, y, px, py);
        }

        px = x;
        py = y;
    }
}

function draw() {
    stroke(255);
    if (mousePointsX != undefined) {
        drawLine(mousePointsX, mousePointsY);
    }

    if (fingerPointsX != undefined) {
        drawLine(fingerPointsX, fingerPointsY);
    }
}
