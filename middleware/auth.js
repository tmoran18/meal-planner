const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secret = process.env.jwtSecret;

module.exports = function (req, res, next) {
	// Get the token from the header
	const token = req.header('x-auth-token');

	// If ther is NO token in the header - return error message
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorisation denied' });
	}

	// if there is a token verify it
	try {
		// Payload will end up in decoded
		const decoded = jwt.verify(token, secret);

		req.user = decoded.user;
		next();
	} catch (error) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
};
