const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

// Server configuration.
let app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('training'));
app.listen(3000);

// 'right' post route.
app.post('/right', (req, res) => {
    // Parse swipe.
    let swipe = req.body;
    console.log(swipe);

    // Declare filename to save to.
    let filename = 'training/data/right_swipe.json';

    // Save to file.
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
