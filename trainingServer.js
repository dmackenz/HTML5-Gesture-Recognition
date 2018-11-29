let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');

let app = express();
app.use(bodyParser.urlencoded({extended:true}));
let server = app.listen(3000);
app.use(express.static('training'));

app.post('/right', function (req, res) {
    let swipe = req.body;
    console.log(swipe);
    let filename = 'training/data/right_swipe.json';

    fs.readFile(filename, (err, data) => {
        console.log(data);
        let json = [];
        if (data.byteLength != 0) {
            json = JSON.parse(data);
        }
        json.push(swipe);
        console.log(json);
        fs.writeFile(filename, JSON.stringify(json, null, 4), (err) => {
            if (err) { console.log(err); }
        });
    })
});