const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const highScoresFile = path.join(__dirname, 'highScores.json');

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
    // console.log('Resolved image path:', imagePath);
    // console.log('[CURRENT-MEME] Resolved image path:', imagePath);

    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error(err); // Log the error for debugging
            res.status(404).send('Image not found');
        }
    });
});

// Helper function to read high scores safely
function readHighScores() {
    try {
        const data = fs.readFileSync(highScoresFile, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error('Error reading highScores.json:', error);
        return []; // Return an empty array on error
    }
}

// Helper function to write high scores safely
function writeHighScores(scores) {
    try {
        fs.writeFileSync(highScoresFile, JSON.stringify(scores, null, 2));
    } catch (error) {
        console.error('Error writing highScores.json:', error);
    }
}

// Initialize high scores file if it doesn't exist
if (!fs.existsSync(highScoresFile)) {
    fs.writeFileSync(highScoresFile, JSON.stringify([]));
}

// Endpoint to get high scores
app.get('/api/high-scores', (req, res) => {
    const highScores = JSON.parse(fs.readFileSync(highScoresFile, 'utf-8'));
    // Return top 10 scores, sorted descending
    res.json(highScores.sort((a, b) => b.score - a.score).slice(0, 10));
});

// Endpoint to submit a new score
app.post('/api/submit-score', express.json(), (req, res) => {
    const { name, score } = req.body;

    // Validate name: 3 uppercase characters
    if (!name || typeof name !== 'string' || name.length !== 3 || !/^[A-Z]{3}$/.test(name)) {
        return res.status(400).json({ error: 'Name must be exactly 3 uppercase letters.' });
    }

    // Validate score: positive number
    if (typeof score !== 'number' || score < 0) {
        return res.status(400).json({ error: 'Score must be a non-negative number.' });
    }

    const highScores = readHighScores();

    // Add the new score with the current date
    const newScore = {
        name,
        score,
        date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    };

    highScores.push(newScore);
    writeHighScores(highScores);

    res.status(200).json({ message: 'Score submitted successfully' });
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
