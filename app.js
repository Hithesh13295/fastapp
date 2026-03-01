const express = require('express');
const app = express();

app.get('/', (req, res) => res.send("DevOps Assignment Success"));

app.listen(3000, '0.0.0.0');