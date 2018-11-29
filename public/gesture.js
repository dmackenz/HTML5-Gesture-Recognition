let socket = io.connect('http://localhost:3000');
socket.on('gesture', (data) => {
    console.log(data);
});
