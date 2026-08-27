const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./models/User');  // MongoDB model
const session = require('express-session');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

// Create Account Endpoint
app.post('/register', async (req, res) => {
    const { name, email, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, username, password: hashedPassword });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Error creating account');
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else {
        res.status(401).send('Invalid username or password');
    }
});

// Dashboard Page
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.send(`<h1>Welcome to your Dashboard, ${req.session.user.name}</h1>`);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
