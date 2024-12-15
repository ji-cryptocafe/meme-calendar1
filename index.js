const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.get('/css/darkmode-toggle.css', (req, res) => {
    res.sendFile(__dirname + '/public/css/darkmode-toggle.css');
});
// Serve the current month's meme image
app.get('/current-meme', (req, res) => {
    const currentDate = new Date();
    let monthNumber = currentDate.getMonth(); // 0 for January, 1 for February, ..., 11 for December

    // Adjust month number for your naming convention
    if (monthNumber === 11) { // December
        monthNumber = 0; // Serve '00.jpg'
    } else {
        monthNumber += 1; // Increment month number for naming (01, 02, ..., 11)
    }

    const imagePath = `/images/${String(monthNumber).padStart(2, '0')}.jpg`; // Format as two digits
    res.sendFile(path.join(__dirname, 'public', imagePath), (err) => {
        if (err) {
            res.status(err.status).end();
        }
    });
});



// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
