const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) => {
    const userData = req.body;
    const filePath = path.join(__dirname, 'userData.json');

    // Read existing data from the JSON file
    fs.readFile(filePath, (err, data) => {
        if (err && err.code === 'ENOENT') {
            // File does not exist, create it with the initial user data
            fs.writeFile(filePath, JSON.stringify([userData], null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Internal server error' });
                }
                return res.json({ success: true });
            });
        } else if (err) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        } else {
            // File exists, append the new user data
            const existingData = JSON.parse(data);
            existingData.push(userData);

            fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Internal server error' });
                }
                return res.json({ success: true });
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
