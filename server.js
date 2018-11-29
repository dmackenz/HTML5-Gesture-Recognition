let express = require('express');
let socket = require('socket.io');

let app = express();
let server = app.listen(3000);
app.use(express.static('public'));

let io = socket(server);
io.sockets.on('connection', (socket) => {
    console.log(`New connection [${socket.id}]`);

    socket.on('stroke', (data) => {
        let pointsX = interpolateArray(data.x, 25);
        let pointsY = interpolateArray(data.y, 25);

        console.log(pointsX[0], pointsY[0], pointsX.length);

        socket.emit('gesture', {
            message:"model output"
        });
    });
});

function interpolateArray(data, fitCount) {
    let linearInterpolate = function(before, after, atPoint) {
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