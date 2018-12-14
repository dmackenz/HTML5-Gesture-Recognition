const dataFunctions = require('./training/dataFunctions.js');
const modelFunctions = require('./training/modelFunctions.js');

const config = {
    filenames: {
        'right':'right_swipes',
        'left':'left_swipes',
        'down':'down_swipes',
        'up':'up_swipes'
    },
    network: {
        inputSize:10,
        outputSize:4,
        trainRatio:0.8,
        learningRate:0.1
    }
}

async function train() {
    let data = dataFunctions.createTrainingData(config);
    // let model = modelFunctions.createModel(config);
    // data.trainInputs.print();
    // data.trainOutputs.print();

    // console.log(data.trainInputs, data.trainOutputs);


    // const response = await model.fit(data.trainInputs, data.trainOutputs, {epochs: 50, verbose:true});
    // console.log(response);
}

train();