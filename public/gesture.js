let socket = io.connect(URL + ':' + PORT);
socket.on('gesture', (data) => {
    console.log(data);
});
