const express = require('express');
const app = express();

// Open localhost:3000 to generate training data.
app.use(express.static('dataGeneration'));
app.listen(3000);