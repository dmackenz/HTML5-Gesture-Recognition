function setup() {
    createCanvas(400, 400);
    background(0);
}

function draw() {
    frameRate(5);
    stroke(random(255), random(255), random(255));
}

let xs = [];
let ys = [];

function touchStarted(e) {
    xs = [];
    ys = [];
}

function touchMoved(e) {
    xs.push(mouseX);
    ys.push(mouseY);
}

function touchEnded(e) {
    for (let i = 0; i < xs.length; i++) {
        xs[i] = map(xs[i], 0, windowWidth, 0, 1);
        ys[i] = map(ys[i], 0, windowHeight, 0, 1);
    }
    let data = {
        x:xs,
        y:ys
    };

    let px = null;
    for (let i = 0; i < xs.length; i++) {
        let x = map(xs[i], 0, 1, 0, width);
        let y = map(ys[i], 0, 1, 0, height);
        if (px) {
            line(px, py, x, y);
        }
        px = x;
        py = y;
    }

    let url = "http://localhost:3000/right";
    upload(url, data);
}

let upload = null;
$(document).ready(function() {
    upload = function(url, json) {
        console.log(url, json);
        $.post(url, json, (data, status) => {
            console.log(`${data} and status is ${status}`);
        });
    }
});