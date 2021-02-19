const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.jwtSecret;

const User = require('../models/User');

// @route       GET api/auth
// @desc        Get logged in user
// @access      Private
router.get('/', (req, res) => {
	res.send('Register a user');
});

// @route       POST api/auth
// @desc        Auth user & get token
// @access      Public
router.post(
	'/',
	[
		check('name', 'Please include a name').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check(
			'password',
			'Please enter a password with 6 or more characters',
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			if (user) {
				return res.status(400).json({ msg: 'User already exists' });
			}

			user = new User({
				name,
				email,
				password,
			});

			// Generates a salt for password salting
			const salt = await bcrypt.genSalt(10);
			// Hash the password
			user.password = await bcrypt.hash(password, salt);
			// Insert the user record
			await user.save();

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				secret,
				{
					expiresIn: 360000,
				},
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				},
			);
		} catch (error) {
			console.error(error.message);
			res.status(500).send({ msg: 'Server Error' });
		}
	},
);

module.exports = router;
