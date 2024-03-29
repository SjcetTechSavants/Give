const User = require('../models/user');
const Organization=require('../models/organization')
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (user) {
      // User found, check if password is correct
      if (user.password === password) {
        // Password is correct
        return res.status(200).json({ success: true, message: 'Login successful', table: 'users', user });
      } else {
        // Incorrect password
        return res.status(400).json({ success: false, message: 'Incorrect password' });
      }
    }

    // Find the organization by email
    const organization = await Organization.findOne({ email_id: email });

    if (organization) {
      // Organization found, check if password is correct
      if (organization.password === password) {
        // Password is correct
        return res.status(200).json({ success: true, message: 'Login successful', table: 'organizations', organization });
      } else {
        // Incorrect password
        return res.status(400).json({ success: false, message: 'Incorrect password' });
      }
    }

    // User or organization not found
    res.status(400).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    // Error occurred during login
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred during login' });
  }
});

router.post('/reg', async (req, res) => {
  try {
    const { name, email, password, regno } = req.body;

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Create a new user
    const user = new User({
      name,
      email,
      password,
      regNo: regno,
    });

    const savedUser = await user.save();
    if (!savedUser) {
      return res.status(400).json({ message: 'User cannot be created' });
    }

    res.status(200).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

  router.get('/fetchUsername/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the user by ID
      const user = await User.findById(id);
  
      // If user is not found, return an error
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user's name
      res.status(200).json({ name: user.name, email: user.email, phone: user.phone});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  router.put('/update/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone,newPassword } = req.body;
  
      // Find the user by ID
      const user = await User.findById(id);
  
      if (!user) {
        // User not found
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's name, email, and phone
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      if (newPassword) {
        user.password = newPassword;
      }
      // Save the updated user to the database
      const updatedUser = await user.save();
  
      // Return the updated user object
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  module.exports =router;