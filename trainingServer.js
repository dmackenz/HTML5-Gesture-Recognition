const express = require('express');
const bodyParser = require('body-parser');

// Server configuration.
let app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('training'));
app.listen(3000);
