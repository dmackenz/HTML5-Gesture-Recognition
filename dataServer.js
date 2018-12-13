const express = require('express');
const app = express();

// Open localhost:3000 to generate training data.
app.use(express.static('training'));
app.listen(3000);