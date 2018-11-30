let fingerPointsX = undefined;
let fingerPointsY = undefined;
let mousePointsX = undefined;
let mousePointsY = undefined;
const EVENT_NAME = 'stroke';

/**
 * Linearly scales an array of x or y coordinates from [0, width or height] to [0, 1].
 */
function normalizeToScreen(arr, widthOrHeight) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = map(arr[i], 0, widthOrHeight, 0, 1);
    }
    return arr;
}

/**
 * Emits the swipe event to be recorded by the server.
 */
function sendSwipeToServer(xs, ys) {
    socket.emit(EVENT_NAME, {
        x:xs,
        y:ys
    });
}

/**
 * Clears array that tracks touch x and y when screen is pressed.
 */
function touchStarted(e) {
    fingerPointsX = [];
    fingerPointsY = [];
}

/**
 * Clears array that tracks mouse x and y when screen is clicked.
 */
function mousePressed(e) {
    mousePointsX = [];
    mousePointsY = [];
}

/**
 * Tracks touch x and y when finger is dragged on screen.
 */
function touchMoved(e) {
    fingerPointsX.push(mouseX);
    fingerPointsY.push(mouseY);
}

/**
 * Tracks pointer x and y when mouse is dragged on screen.
 */
function mouseDragged(e) {
    mousePointsX.push(e.clientX);
    mousePointsY.push(e.clientY);
}

/**
 * Sends touch data to server when swipe is ended.
 */
function touchEnded(e) {
    fingerPointsX = normalizeToScreen(fingerPointsX, windowWidth);
    fingerPointsY = normalizeToScreen(fingerPointsY, windowHeight);
    sendSwipeToServer(fingerPointsX, fingerPointsY);
}

/**
 * Sends mouse data to server when gesture is ended.
 */
function mouseReleased(e) {
    mousePointsX = normalizeToScreen(mousePointsX, windowWidth);
    mousePointsY = normalizeToScreen(mousePointsY, windowHeight);
    sendSwipeToServer(mousePointsX, mousePointsY);
}






