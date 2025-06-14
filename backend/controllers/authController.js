const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
  return res.status(200).json({
    message: 'User already exists with this username',
    user: {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      role: existingUser.role
    }
  });
}


    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await newUser.save();

    //res.status(201).json({ message: 'User registered successfully' });
    console.log({
  message: 'User registered successfully',
  user: {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role
  }
});

  res.status(201).json({
  message: 'User registered successfully',
  user: {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role
  }
});


  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const {  username, password } = req.body;

    
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Find user
    const user = await User.findOne({  username });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    // Create JWT
    const payload = {
      user: {
      id: user._id,
      username: user.username,
      role: user.role
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: payload });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
