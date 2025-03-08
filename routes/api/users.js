const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User'); // User model

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'Please provide a password with 6 or more characters').isLength({min : 6})
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors : errors.array()});
    }
    const { name, email, password } = req.body;

    
    try {
    // See if user exists
        let user = await User.findOne({
            email
        });
        if (user) {
            return res.status(400).json({errors : [{msg : 'User already exists'}]});
        }
    // Get user's gravatar
        const avatar = gravatar.url(email, {
            s : '200',
            r : 'pg',
            d : 'mm'
        });

        // Create an instance of the User model
        user = new User({
            name,
            email,
            avatar,
            password
        });

    // Encrypt password
        const salt = await bcrypt.genSalt(10); // Generate a salt to hash the password with (10 rounds)
        user.password = await bcrypt.hash(password, salt); // Hash the password with the salt
        await user.save(); // Save user to the database

    // Return jsonwebtoken (JWT) -> this is the token that allows the user to log in after registering

     res.send('User Registered');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});         // / => /api/users

module.exports = router;