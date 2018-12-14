const fs = require('fs');
const tf = require('@tensorflow/tfjs');
const shuffle = require('shuffle-array');

function createTrainingData(config) {
    let swipes = loadData(config.filenames);
    swipes = normalizeData(swipes, config.network.inputSize / 2);
    encodeData(swipes, config.network.outputSize);
    // const inputs = encodeInputs(swipes);
    // const outputs = encodeOutputs(swipes, config.network.outputSize);

    // const splitIndex = inputs.length * config.network.trainRatio;
    // const trainInputs = tf.tensor2d(inputs.slice(0, splitIndex))
    // const validateInputs = tf.tensor2d(inputs.slice(splitIndex));
    // const trainOutputs = tf.tensor2d(outputs.slice(0, splitIndex))
    // const validateOutputs = tf.tensor2d(outputs.slice(splitIndex));

    // return {
    //     trainInputs,
    //     validateInputs,
    //     trainOutputs,
    //     validateOutputs
    // };

    return null;
}

function encodeData(swipes, outputSize) {
    let data = [];

    let hotIndex = 0;

    // console.log(swipes);

    for (let key of Object.keys(swipes)) {
        for (let i = swipes[key].length - 1; i >= 0; i--) {
            let index = Math.floor(Math.random() * swipes[key].length);

            let swipe = swipes[key].splice(index, 1)[0];
            console.log(swipes[key].length);

            console.log(swipe);
            let input = swipe.xs;
            input = input.concat(swipe.ys);

            const oneHot = new Array(outputSize).fill(0);
            oneHot[hotIndex] = 1;

            console.log(input);

            break;
        }
        hotIndex++;
    }


    // shuffle by grabbing random index of data

    // return object with two shuffled arrays
}

function loadData(filenames) {
    let swipes = [];
    for (let key of Object.keys(filenames)) {
        swipes[filenames[key]] = JSON.parse(fs.readFileSync(`./dataGeneration/data/${filenames[key]}.json`));
    }
    return swipes;
}

function normalizeData(swipes, dataLength) {
    for (let key of Object.keys(swipes)) {
        swipes[key].map((swipe) => {
            swipe.xs = interpolateArray(swipe.xs, dataLength);
            swipe.ys = interpolateArray(swipe.ys, dataLength);
            return swipe;
        });
    }

    return swipes;
}

// function encodeInputs(swipes) {
    
//     return inputData;
// }

// function encodeOutputs(swipes, outputSize) {
//     let outputData = [];

//     for (let key of Object.keys(swipes)) {
//         swipes[key].forEach((swipe) => {
//             const oneHot = new Array(outputSize).fill(0);
//             oneHot[hotIndex] = 1;
//             outputData.push(oneHot);
//         });

//         hotIndex++;
//     }
//     return outputData;
// }

function interpolateArray(data, fitCount) {
    function linearInterpolate(before, after, atPoint) {
        return before + (after - before) * atPoint;
    };

    let newData = new Array();
    let springFactor = new Number((data.length - 1) / (fitCount - 1));
    newData[0] = data[0];
    for (let i = 1; i < fitCount - 1; i++) {
        let tmp = i * springFactor;
        let before = new Number(Math.floor(tmp)).toFixed();
        let after = new Number(Math.ceil(tmp)).toFixed();
        let atPoint = tmp - before;
        newData[i] = linearInterpolate(data[before], data[after], atPoint);
    }
    newData[fitCount - 1] = data[data.length - 1];
    return newData;
};

module.exports = {
    createTrainingData
};


