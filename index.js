const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/css/darkmode-toggle.css', (req, res) => {
    res.sendFile(__dirname + '/public/css/darkmode-toggle.css');
});
// Serve the current month's meme image
app.get('/current-meme', (req, res) => {
    const currentDate = new Date();
    let monthNumber = currentDate.getMonth();

    // Adjust for naming convention
    if (monthNumber === 11) {
        monthNumber = 0;
    } else {
        monthNumber += 1;
    }

    const imagePath = path.join(__dirname, 'public', 'images', `${String(monthNumber).padStart(2, '0')}.jpg`);

    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error(err); // Log the error for debugging
            res.status(404).send('Image not found');
        }
    });
});




// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
