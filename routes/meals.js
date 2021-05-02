const express = require('express')
const cloudinary = require('cloudinary').v2
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')

const User = require('../models/User')
const Meal = require('../models/Meal')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

// @route       GET api/meals
// @desc        Get all users meals
// @access      Private
router.get('/', auth, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id })
    res.json(meals)
  } catch (error) {
    console.error(error.messages)
    res.status(500).send('Server Error')
  }
})

// @route       POST api/meal
// @desc        Add new meal
// @access      Private
router.post(
  '/',
  [
    auth,
    check('name', 'Name is required').not().isEmpty(),
    check('secondary_name', 'Secondary name is required').not().isEmpty(),
    check('image_URL', 'Image URL is required').not().isEmpty(),
    check('ingredients', 'Ingredients are required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, secondary_name, image_URL, imageID, ingredients } = req.body

    try {
      const newMeal = new Meal({
        name,
        secondary_name,
        image_URL,
        imageID,
        ingredients,
        user: req.user.id,
      })

      const meal = await newMeal.save()
      res.json(meal)
    } catch (error) {
      console.error(error.message)
      res.status(500).send({ msg: 'Server Error' })
    }
  }
)

// @route       PUT api/meal
// @desc        Edit a meal
// @access      Private
router.put('/:id', auth, async (req, res) => {
  try {
    await Meal.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    })
    res.send('Edit a Meal')
  } catch (error) {}
  console.error(error.messages)
  res.status(500).send('Server Error')
})

// @route       DELETE api/meal
// @desc        Delete a meal
// @access      Private
router.delete('/:imageID', auth, async (req, res) => {
  const image_id = `meal-shopper/${req.params.imageID}`
  try {
    await Meal.findOneAndRemove({ imageID: image_id })
    // await cloudinary.uploader.destroy(imageID, function (error, result) {
    //   console.log(result, error)
    // })
    res.send(req.params.imageID)
  } catch (error) {}
  console.error(error.messages)
  res.status(500).send('Server Error')
})

module.exports = router
