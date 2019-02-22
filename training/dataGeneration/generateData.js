// Settings for creating training set.
const numberSamples = 10000;
const numberFrames = 600;
const displayToCanvas = true;

// Filenames for the swipes.
const rightName = 'right_swipes';
const leftName = 'left_swipes';
const downName = 'down_swipes';
const upName = 'up_swipes';

let count;
let swipes = [];
let swipesPerFrame;
let container = 'centered';

/**
 * Setup for page.
 */
function setup() {
    // Canvas to show debug information of swipes.
    const canvas = createCanvas(floor(3 * windowWidth / 4), floor(3 * windowHeight / 4));
    canvas.parent(container);
    background(0);
    strokeWeight(2);

    count = 0;

    // Create associative array for holding the swipe information in memory.
    swipes = [];
    swipes[rightName] = [];
    swipes[leftName ] = [];
    swipes[downName ] = [];
    swipes[upName   ] = [];
    swipesPerFrame = floor(numberSamples / numberFrames);

    createP(`Swipes per frame: ${swipesPerFrame}`).parent(container);
    createP(`This script will run for approximately ${numberFrames / 60} seconds.`).parent(container);;
}


/**
 * The main draw loop.
 */
function draw() {
    // Create and display swipes for the frame in the canvas.
    for (let i = 0; i < swipesPerFrame; i++) {
        swipes[rightName].push(rightSwipe());
        swipes[leftName ].push(leftSwipe());
        swipes[upName   ].push(upSwipe());
        swipes[downName ].push(downSwipe());

        count++;
    }

    if (count >= numberSamples) {
        // Save all swipes to a file.
        saveJSON(swipes[rightName], rightName + '.json', false);
        saveJSON(swipes[leftName ], leftName + '.json', false);
        saveJSON(swipes[upName   ], upName + '.json', false);
        saveJSON(swipes[downName ], downName + '.json', false);

        // Only create the training set once.
        noLoop();
    }
}