let mousePointsX = undefined;
let mousePointsY = undefined;

function mousePressed(e) {
    mousePointsX = [];
    mousePointsY = [];
}

function mouseDragged(e) {
    mousePointsX.push(e.clientX);
    mousePointsY.push(e.clientY);
}

function mouseReleased(e) {
    for (let i = 0; i < mousePointsX.length; i++) {
        mousePointsX[i] = map(mousePointsX[i], 0, windowWidth, 0, 1);
        mousePointsY[i] = map(mousePointsY[i], 0, windowHeight, 0, 1);
    }
    socket.emit('stroke', {
        x:mousePointsX,
        y:mousePointsY
    });
}
