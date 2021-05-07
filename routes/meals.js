const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')

const User = require('../models/User')
const Meal = require('../models/Meal')

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

    const {
      name,
      secondary_name,
      image_URL,
      imageID,
      ingredients,
      steps,
    } = req.body

    try {
      const newMeal = new Meal({
        name,
        secondary_name,
        image_URL,
        imageID,
        ingredients,
        steps,
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

module.exports = router
