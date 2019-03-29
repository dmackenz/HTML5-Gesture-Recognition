let xs = [];
let ys = [];
let cordP;
let model;

async function loadModel() {
    const uploadJSONInput = document.getElementById('upload-json');
    const uploadWeightsInput = document.getElementById('upload-weights');
    // model = await tfl.loadModel(tf.io.browserFiles([uploadJSONInput.files[0], uploadWeightsInput.files[0]])).then((res) => {
    //     console.log(res);
    // });
}

function setup() {
    console.log(model);
    let canvas = createCanvas(480, 640);
    canvas.parent('centered');
    reset();
    cordP = createSpan();
    cordP.parent('coordinates');
}

function makeCoordinateString() {
    let str = '';
    for (let i = 0; i < xs.length; i++) {
        str += `(${xs[i] * width}, ${ys[i] * height})<br>`;
    }
    return str;
}

function reset() {
    xs = [];
    ys = [];
    background(0);
}

function draw() {
    strokeWeight(4);
    stroke(255);

    for (let i = 0; i < xs.length - 1; i++) {
        line(xs[i] * width, ys[i] * height, xs[i + 1] * width, ys[i] * height);
    }
}

function mouseDragged(e) {
    xs.push(mouseX / width);
    ys.push(mouseY / height);
    cordP.html(makeCoordinateString());
}

function mouseReleased(e) {
    reset();
}