// Create canvas to display the swipe as its being recorded.
function setup() {
    createCanvas(400, 400);
    background(0);
}

// Track the x and y coordinates of the swipe.
let xPoints = [];
let yPoints = [];

function touchStarted(e) {
    // Clear coordinates array each time display is touched.
    xPoints = [];
    yPoints = [];
}

function touchMoved(e) {
    // Push the x and y location each time the finger moves.
    xPoints.push(mouseX);
    yPoints.push(mouseY);
}

function touchEnded(e) {
    // Normalize the swipe to only contain data between 0 and 1.
    // This makes the algorithm independent of viewport size.
    for (let i = 0; i < xPoints.length; i++) {
        xPoints[i] = map(xPoints[i], 0, windowWidth, 0, 1);
        yPoints[i] = map(yPoints[i], 0, windowHeight, 0, 1);
    }

    // Construct JSON object of swipe.
    let swipe = {
        x:xPoints,
        y:yPoints
    };

    // Draw the swipe that just occurred to the canvas for debugging purposes.
    let px = null;
    stroke(random(255), random(255), random(255));
    for (let i = 0; i < xPoints.length; i++) {
        let x = map(xPoints[i], 0, 1, 0, width);
        let y = map(yPoints[i], 0, 1, 0, height);
        if (px) { line(px, py, x, y); }
        px = x;
        py = y;
    }

    // Upload the swipe to the server to be recorded.
    upload(URL + "/right", swipe);
}

// Declaration of post function for each swipe.
let upload = null;
$(document).ready(function() {
    upload = function(url, json) {
        console.log(url, json);
        $.post(url, json, (data, status) => {
            console.log(`${data} and status is ${status}`);
        });
    }
});
