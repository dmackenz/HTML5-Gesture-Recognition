const express = require('express');

// Server configuration.
let app = express();
app.use(express.static('training'));
app.listen(3000);
