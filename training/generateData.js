/**
 * Setup for page.
 */
function setup() {
    // Canvas to show debug information of swipes.
    createCanvas(400, 400);
    background(0);
    strokeWeight(2);
}

/**
 * The main draw loop.
 */
function draw() {
    // Settings for creating training set.
    const numberSamples = 10000;
    const displayToCanvas = true;

    // Generate right swipes.
    generateSwipes(numberSamples, 'right_swipes.json', displayToCanvas, rightSwipe);
    // Generate up swipes.
    generateSwipes(numberSamples, 'up_swipes.json', displayToCanvas, upSwipe);
    // Generate down swipes.
    generateSwipes(numberSamples, 'down_swipes.json', displayToCanvas, downSwipe);
    // Generate left swipes.
    generateSwipes(numberSamples, 'left_swipes.json', displayToCanvas, leftSwipe);

    // Only create the training set once.
    noLoop();
}

/**
 * Generate a series of sipes and save them to a file.
 * @param {number} numerOfSwipes - The number of swipes to generate.
 * @param {string} fileToSaveTo - The filename to save swipes to.
 * @param {boolean} displayToCanvas - true if swipes are to display on canvas.
 * @param {Function} swipeGenerator - callback function the creates Swipe object.
 */
function generateSwipes(numerOfSwipes, fileToSaveTo, displayToCanvas, swipeGenerator) {
    let swipes = [];

    for (let i = 0; i < numerOfSwipes; i++) {
        swipes.push(swipeGenerator(displayToCanvas));
    }

    saveJSON(swipes, fileToSaveTo, false);

    return swipes;
}

/**
 * Create a down swipe.
 * @param {boolean} displayToCanvas - true if swipes are to display on canvas.
 */
function downSwipe(displayToCanvas) {
    const steps = floor(random(5, 15));
    const x1 = floor(random(0, width));
    const y1 = floor(random(0, height));
    const x2 = floor(x1 + random(-(width / 20), width / 20));
    const y2 = floor(y1 + random(y1, height - y1));
    return makeSwipe(x1, y1, x2, y2, steps, 'down', displayToCanvas);
}

/**
 * Create an up swipe.
 * @param {boolean} displayToCanvas - true if swipes are to display on canvas.
 */
function upSwipe(displayToCanvas) {
    const steps = floor(random(5, 15));
    const x1 = floor(random(0, width));
    const y1 = floor(random(0, height - height / 20));
    const x2 = floor(x1 + random(-(width / 20), width / 20));
    const y2 = floor(y1 + random(20, height - y1));
    return makeSwipe(x1, y1, x2, y2, steps, 'up', displayToCanvas);
}

/**
 * Create a left swipe.
 * @param {boolean} displayToCanvas - true if swipes are to display on canvas.
 */
function leftSwipe(displayToCanvas) {
    const steps = floor(random(5, 15));
    const x1 = floor(random(0, width - width / 20));
    const y1 = floor(random(0, height));
    const x2 = floor(x1 + random(20, width-x1));
    const y2 = floor(y1 + random(-(height / 20), (height / 20)));
    return makeSwipe(x2, y2, x1, y1, steps, 'left', displayToCanvas);
}

/**
 * Create a right swipe.
 * @param {boolean} displayToCanvas - true if swipes are to display on canvas.
 */
function rightSwipe(displayToCanvas) {
    const steps = floor(random(5, 15));
    const x1 = floor(random(0, width - width / 20));
    const y1 = floor(random(0, height));
    const x2 = floor(x1 + random(20, width-x1));
    const y2 = floor(y1 + random(-(height / 20), (height / 20)));
    return makeSwipe(x1, y1, x2, y2, steps, 'right', displayToCanvas);
}

/**
 * Generic algorithm for creating a single swipe given two cartesian coordinates.
 * @param {number} x1 - The first x coordinate.
 * @param {number} y1 - The first y coordinate.
 * @param {number} x2 - The second x coordinate.
 * @param {number} y2 - The second y coordinate.
 * @param {number} numberInterpolatedPoints - The number of points to be interpolated on the swipe.
 * @param {string} swipeType - The label for the type of swipe that is being generated.
 * @param {boolean} displayToCanvas - true if swipes are to display on canvas.
 */
function makeSwipe(x1, y1, x2, y2, numberInterpolatedPoints, swipeType, displayToCanvas) {
    let xs = [];
    let ys = [];

    let previousX = x1;
    let previousY = y1;

    // For the number of points in swipe to be interpolated.
    for (let i = 0; i < numberInterpolatedPoints; i++) {
        previousX = lerp(previousX, x2, 1 / numberInterpolatedPoints);
        previousY = lerp(previousY, y2, 1 / numberInterpolatedPoints);
        xs.push(previousX);
        ys.push(previousY);
    }

    // Draw to canvas if set to true.
    if (displayToCanvas) {
        stroke(random(255), random(255), random(255));
        line(x1, y1, x2, y2);
    }

    // Normalize the swipe to only contain data between 0 and 1.
    // This makes the algorithm independent of viewport size.
    for (let i = 0; i < xs.length; i++) {
        xs[i] = map(xs[i], 0, width, 0, 1);
        ys[i] = map(ys[i], 0, height, 0, 1);
    }

    return {
        xs,
        ys,
        swipeType
    };
}