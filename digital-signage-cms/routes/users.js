// routes/users.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

// Register User
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      console.log('Received registration request:', req.body);

      let user = await User.findOne({ email });
      if (user) {
        console.log('User already exists');
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password,
        role,
      });

      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(password, salt);
      console.log('Generated Hash (before save):', user.password);

      console.log('User object before save:', user);

      await user.save();
      console.log('User saved successfully with role:', user.role);

      // Retrieve the saved user to log the stored hash
      const savedUser = await User.findOne({ email });
      console.log('Stored Hash (after save):', savedUser.password);

      console.log('User object after save:', savedUser);

      const payload = {
        user: {
          id: savedUser.id,
          role: savedUser.role, // Include role in payload
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            console.error('Error signing token:', err);
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Server error:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// Authenticate User and Get Token
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      console.log('Received login request:', req.body);

      let user = await User.findOne({ email });
      if (!user) {
        console.log('Invalid email');
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      if (user.banned) {
        console.log('User is banned');
        return res.status(403).json({ msg: 'Your access was banned' });
      }

      console.log('Stored hashed password:', user.password);
      console.log('Entered password:', password);
      console.log('Stored hashed password length:', user.password.length);
      console.log('Entered password length:', password.length);

      const isMatch = await bcrypt.compare(password, user.password);
      
      console.log('Comparison result:', isMatch);

      if (!isMatch) {
        console.log('Passwords do not match');
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      console.log('Passwords match');
      const payload = {
        user: {
          id: user.id,
          role: user.role, // Include role in payload
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              role: user.role, // Include role in the response
            },
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Get all users (only accessible by Admin)
router.get('/', [auth, checkRole(['Admin'])], async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Ban a user (only accessible by Admin)
router.patch('/:id/ban', [auth, checkRole(['Admin'])], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.banned = true;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

// Unban a user (only accessible by Admin)
router.patch('/:id/unban', [auth, checkRole(['Admin'])], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.banned = false;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
