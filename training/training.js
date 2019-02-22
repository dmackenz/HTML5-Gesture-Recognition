const SwipeClassifier = require('./model').SwipeClassifier;
const NetworkDescription = require('./model').NetworkDescription;
const OutputLabels = require('./model').OutputLabels;

const inputSize = 10;
const outputSize = 4;
const learningRate = 0.1;

const filenames = [
    './dataGeneration/data/right_swipes.json',
    './dataGeneration/data/left_swipes.json',
    './dataGeneration/data/down_swipes.json',
    './dataGeneration/data/up_swipes.json'
];
const trainRatio = 0.8;

let model = new SwipeClassifier(
    new NetworkDescription(inputSize, outputSize, learningRate),
    new OutputLabels(['right', 'left', 'up', 'down'])
);

model.trainModel(filenames, trainRatio);