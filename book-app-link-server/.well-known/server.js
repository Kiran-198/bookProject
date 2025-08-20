const express = require('express');
const path = require('path');

const app = express();

// Serve .well-known folder as static
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
