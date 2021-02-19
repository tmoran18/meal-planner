const express = require('express');
const router = express.Router();

// @route       GET api/meals
// @desc        Get all users meals
// @access      Private
router.get('/', (req, res) => {
	try {
		res.send('Test API is working');
	} catch (error) {
		console.error(error.messages);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
