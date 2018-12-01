// Create canvas to display the swipe as its being recorded.
function setup() {
    createCanvas(400, 400);
    background(0);
}

function draw() {
    stroke(255);
    strokeWeight(2);

    const numberSamples = 10000;
    const isDebugMode = false;

    generateSwipes(rightSwipe, numberSamples, 'right_swipes.json', isDebugMode);
    generateSwipes(upSwipe, numberSamples, 'up_swipes.json', isDebugMode);
    generateSwipes(downSwipe, numberSamples, 'down_swipes.json', isDebugMode);
    generateSwipes(leftSwipe, numberSamples, 'left_swipes.json', isDebugMode);

    noLoop();
}

function generateSwipes(func, n, filename, isDebugMode) {
    let swipes = [];
    for (let i = 0; i < n; i++) {
        swipes.push(func(isDebugMode));
    }
    saveJSON(swipes, filename, false);

    return swipes;
}

function downSwipe(isDebugMode) {
    const steps = floor(random(5, 15));
    const x1 = floor(random(0, width));
    const y1 = floor(random(0, height));
    const x2 = floor(x1 + random(-(width / 20), width / 20));
    const y2 = floor(y1 + random(y1, height - y1));
    return makeSwipe(x1, y1, x2, y2, steps, "down", isDebugMode);
}

function upSwipe(isDebugMode) {
    const steps = floor(random(5, 15));
    const x1 = floor(random(0, width));
    const y1 = floor(random(0, height - height / 20));
    const x2 = floor(x1 + random(-(width / 20), width / 20));
    const y2 = floor(y1 + random(20, height - y1));
    return makeSwipe(x1, y1, x2, y2, steps, "up", isDebugMode);
}

function leftSwipe(isDebugMode) {
    const steps = floor(random(5, 15));
    const x1 = floor(random(0, width - width / 20));
    const y1 = floor(random(0, height));
    const x2 = floor(x1 + random(20, width-x1));
    const y2 = floor(y1 + random(-(height / 20), (height / 20)));
    return makeSwipe(x2, y2, x1, y1, steps, "left", isDebugMode);
}

function rightSwipe(isDebugMode) {
    const steps = floor(random(5, 15));
    const x1 = floor(random(0, width - width / 20));
    const y1 = floor(random(0, height));
    const x2 = floor(x1 + random(20, width-x1));
    const y2 = floor(y1 + random(-(height / 20), (height / 20)));
    return makeSwipe(x1, y1, x2, y2, steps, "right", isDebugMode);
}

function makeSwipe(x1, y1, x2, y2, steps, swipeType, isDebugMode) {
    let xs = [];
    let ys = [];
    let px = x1;
    let py = y1;
    for (let i = 0; i < steps; i++) {
        px = lerp(px, x2, 1 / steps);
        py = lerp(py, y2, 1 / steps);
        xs.push(px);
        ys.push(py);
    }

    if (isDebugMode) {
        stroke(random(255), random(255), random(255));
        line(x1, y1, x2, y2);
        console.log(xs, ys);
    }

    // Normalize the swipe to only contain data between 0 and 1.
    // This makes the algorithm independent of viewport size.
    for (let i = 0; i < xs.length; i++) {
        xs[i] = map(xs[i], 0, width, 0, 1);
        ys[i] = map(ys[i], 0, height, 0, 1);
    }
    
    if (isDebugMode) {
        console.log(xs, ys);
    }
    
    return {
        xs,
        ys,
        swipeType
    };
}