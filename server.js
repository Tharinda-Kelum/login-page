const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;
  const filePath = path.join(__dirname, 'users.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error reading data file.' });
    }

    const users = JSON.parse(data || '[]');
    const userExists = users.some(user => user.username === username || user.email === email);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Username or email already exists.' });
    }
    const newUser = { username, email, password };
    users.push(newUser);
    fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error saving user data.' });
      }

      res.status(200).json({ success: true, message: 'User successfully created!' });
    });
  });
});
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
