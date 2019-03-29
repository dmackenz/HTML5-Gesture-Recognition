const tf = require("@tensorflow/tfjs");
require("tfjs-node-save");
const fs = require("fs");

class SwipeClassifier {
  constructor(networkDescription, outputLabels) {
    this.network = networkDescription;
    this.labels = outputLabels;
    this.manipulator = new DataManipulator(this.network, this.labels);
    this.model = null;
  }

  intializeUntrainedModel() {
    this.model = tf.sequential();
    this.model.add(
      tf.layers.dense({
        inputShape: [this.network.inputSize],
        units: 16,
        activation: "sigmoid"
      })
    );
    this.model.add(
      tf.layers.dense({ units: this.network.outputSize, activation: "softmax" })
    );
    this.model.compile({
      optimizer: tf.train.sgd(this.network.learningRate),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"]
    });
  }

  async trainModel(filenames, trainRatio, totalEpochs) {
    const shuffle = a => {
      let j, x, i;
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      return a;
    };

    let swipes = [];
    filenames.forEach(filename => {
      const dataObjects = JSON.parse(fs.readFileSync(filename));
      dataObjects.forEach(obj => {
        swipes.push(obj);
      });
    });

    let modelData = [];
    swipes.forEach(swipe => {
      modelData.push(this.manipulator.buildModelData(swipe));
    });

    modelData = shuffle(modelData);

    const splitIndex = Math.floor(modelData.length * trainRatio);
    let temp = {
      train: [],
      validate: []
    };
    temp.train = modelData.slice(0, splitIndex);
    temp.validate = modelData.slice(splitIndex);
    modelData = temp;

    this.intializeUntrainedModel();

    // build training tensors
    let trainingInputArray = [];
    let trainingOutputArray = [];
    for (let i = 0; i < modelData.train.length; i++) {
      trainingInputArray.push(modelData.train[i].input);
      trainingOutputArray.push(modelData.train[i].output);
    }
    const trainingXs = tf.tensor2d(trainingInputArray);
    const trainingYs = tf.tensor2d(trainingOutputArray);

    // build validation tensors
    let validationInputArray = [];
    let validationOutputArray = [];
    for (let i = 0; i < modelData.validate.length; i++) {
      validationInputArray.push(modelData.validate[i].input);
      validationOutputArray.push(modelData.validate[i].output);
    }
    const validateXs = tf.tensor2d(validationInputArray);
    const validateYs = tf.tensor2d(validationOutputArray);

    let currEpoch = 0;
    let epochMessage = () => {
      currEpoch++;
      console.log(
        `Epoch ${currEpoch} begins (${((currEpoch / totalEpochs) * 100).toFixed(
          2
        )}%)`
      );
    };

    const hist = await this.model.fit(trainingXs, trainingYs, {
      epochs: totalEpochs,
      validationData: [validateXs, validateYs],
      shuffle: true,
      callbacks: { onEpochBegin: epochMessage }
    });
    console.log(hist);
    try {
      const folder = "./trained_model/";
      const saveResults = await this.model.save("file://" + folder);
      fs.writeFileSync(folder + "history.json", JSON.stringify(hist, null, 4));
      console.log(saveResults);
    } catch (error) {
      console.log(error);
    }
  }

  queryModel(swipe) {}
}

class NetworkDescription {
  constructor(inputSize, outputSize, learningRate) {
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    this.learningRate = learningRate;
  }
}

class OutputLabels {
  constructor(labels) {
    this.labels = [];
    this.length = 0;
    labels.forEach(label => {
      if (!this.labels[label]) {
        this.labels[label] = this.length;
        this.length++;
      }
    });
  }

  getIndex(label) {
    return this.labels[label];
  }

  print() {
    console.log(this.labels);
  }
}

class DataManipulator {
  constructor(networkDescription, outputLabels) {
    this.networkDescription = networkDescription;
    this.outputLabels = outputLabels;
  }

  buildModelData(swipe) {
    const makeInput = swipe => {
      const interpolateArray = (data, fitCount) => {
        const linearInterpolate = (before, after, atPoint) => {
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

      const dataLength = this.networkDescription.inputSize / 2;
      swipe.xs = interpolateArray(swipe.xs, dataLength);
      swipe.ys = interpolateArray(swipe.ys, dataLength);
      return swipe.xs.concat(swipe.ys);
    };

    const makeOutput = swipe => {
      let oneHot = new Array(this.networkDescription.outputSize).fill(0);
      oneHot[this.outputLabels.getIndex(swipe.swipeType)] = 1;
      return oneHot;
    };

    let input = makeInput(swipe);
    let output = makeOutput(swipe);
    return {
      input,
      output
    };
  }
}

module.exports = {
  SwipeClassifier,
  NetworkDescription,
  OutputLabels,
  DataManipulator
};
