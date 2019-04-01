let xs = [];
let ys = [];

let cordP;
let networkP;
let outputP;

let loadButton;
let model;
let isModelLoaded = false;
let isDragStart = false;

function setup() {
    console.log(model);
    let canvas = createCanvas(480, 640);
    canvas.parent('centered');
    
    reset();
    
    cordP = createSpan();
    cordP.parent('coordinates');
    
    networkP = createP();
    networkP.parent('network-inputs');
    
    outputP = createP();
    outputP.parent('network-output');
    
    loadButton = createButton('Load Model');
    loadButton.parent('load-button');
    loadButton.addClass('btn btn-default');
    loadButton.mousePressed(loadTheModelAndWeights);
}

function draw() {
    strokeWeight(4);
    stroke(255);

    for (let i = 0; i < xs.length - 1; i++) {
        line(xs[i] * width, ys[i] * height, xs[i + 1] * width, ys[i + 1] * height);
    }
}

function mousePressed(e) {
	reset();
}

function mouseDragged(e) {
	if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
		isDragStart = true;
	    xs.push(mouseX / width);
		ys.push(mouseY / height);
		swipeToNetworkInputs();
		cordP.html(makeCoordinateString());
		networkP.html(makeNetworkString(swipeToNetworkInputs()));
	}
}

function mouseReleased(e) {
	if (isDragStart == true) {
		if (isModelLoaded == true) {
			let input = swipeToNetworkInputs();
			let tensor = tf.tensor2d([input]);
			let output = model.predict(tensor);
			output.data().then(d => {
				outputP.html(makeOutputString(d));
			});
		}
	}
}

async function loadTheModelAndWeights() {
    const uploadJSONInput = document.getElementById('upload-json');
    const uploadWeightsInput = document.getElementById('upload-weights');
    model = await tf.loadLayersModel(tf.io.browserFiles([uploadJSONInput.files[0], uploadWeightsInput.files[0]]));
    isModelLoaded = true;
    console.log("model loaded");
}

function makeCoordinateString() {
    let str = '';
    for (let i = 0; i < xs.length; i++) {
        str += `(${(xs[i] * width).toFixed(2)}, ${(ys[i] * height).toFixed(2)}) => (${xs[i].toFixed(2)}, ${ys[i].toFixed(2)})<br>`;
    }
    return str;
}

function makeNetworkString(input) {
	let str = '';
	for (let i = 0; i < input.length; i++) {
		str += `[${i}] ${input[i]}<br>`;
	}
	return str;
}

function makeOutputString(output) {
	const indexOfMax = (arr) => {
		if (arr.length === 0) {
			return -1;
		}

		var max = arr[0];
		var maxIndex = 0;

		for (var i = 1; i < arr.length; i++) {
			if (arr[i] > max) {
				maxIndex = i;
				max = arr[i];
			}
		}

		return maxIndex;
	}

	let str = '';
	const maxIndex = indexOfMax(output);
	const labels = ['right', 'left', 'up', 'down'];
	for (let i = 0; i < output.length; i++) {
		if (i == maxIndex) {
			str += '<strong>';
		}
		
		str += `${labels[i]}: ${(output[i] * 100).toFixed(2)}%`;
		
		if (i == maxIndex) {
			str += '</strong>';
		}
		
		str += '<br>';
	}

	return str;
}

function reset() {
    xs = [];
    ys = [];
    background(0);
    isDragStart = false;
}

function swipeToNetworkInputs() {
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

		const dataLength = 5;
		swipe.xs = interpolateArray(swipe.xs, dataLength);
		swipe.ys = interpolateArray(swipe.ys, dataLength);
		return swipe.xs.concat(swipe.ys);
	};

	return makeInput({
		xs:xs,
		ys:ys
	});
}
