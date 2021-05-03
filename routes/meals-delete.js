const express = require('express')
const cloudinary = require('cloudinary').v2
const router = express.Router()
const auth = require('../middleware/auth')

const User = require('../models/User')
const Meal = require('../models/Meal')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

// @route       POST api/meal-delete
// @desc        Add new meal
// @access      Private
router.post('/', auth, async (req, res) => {
  try {
    await Meal.findOneAndRemove({ _id: req.body.id })
    await cloudinary.uploader.destroy(req.body.imageID)
    res.send('worked')
  } catch (error) {
    console.error(error.messages)
    res.status(500).send('Server Error')
  }
})

module.exports = router
