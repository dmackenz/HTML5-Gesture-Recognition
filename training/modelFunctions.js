const tf = require('@tensorflow/tfjs');

function createModel(config) {
    let model = tf.sequential();
    
    model.add(tf.layers.dense({ inputShape:[config.network.inputSize], units: 32, activation:'sigmoid' }));
    model.add(tf.layers.dense({ units: 16, activation:'sigmoid' }));
    model.add(tf.layers.dense({ units: config.network.outputSize, activation:'softmax' }));

    model.compile({ optimizer:tf.train.sgd(config.network.learningRate), loss:'categoricalCrossentropy' });

    return model;
}

module.exports = {
    createModel
};