const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(express.json());

// Connect to your MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

// Route for user registration
app.get('/register', async (req, res) => {
  try {
    // const { username, email } = req.body;

    // Create a new user instance
    const newUser = new User({
      a:"jbsdjc",
      email:"hvbfhv",
    });

    // Save the user to the database
    newUser.rakheeb ="rakheeb"
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
