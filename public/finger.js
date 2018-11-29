let fingerPointsX = undefined;
let fingerPointsY = undefined;

function touchStarted(e) {
    fingerPointsX = [];
    fingerPointsY = [];
}

function touchMoved(e) {
    fingerPointsX.push(mouseX);
    fingerPointsY.push(mouseY);
}

function touchEnded(e) {
    for (let i = 0; i < fingerPointsX.length; i++) {
        fingerPointsX[i] = map(fingerPointsX[i], 0, windowWidth, 0, 1);
        fingerPointsY[i] = map(fingerPointsY[i], 0, windowHeight, 0, 1);
    }
    socket.emit('stroke', {
        x:fingerPointsX,
        y:fingerPointsY
    });
}
