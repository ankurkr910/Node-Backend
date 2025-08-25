const express = require('express');
 

const app = express();

const PORT = 7777;
app.use((req, res, next) => {
    res.send('Hello from Node.js server!'); // Simple response for all requi
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});