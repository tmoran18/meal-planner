const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')

const User = require('../models/User')
const Ingredient = require('../models/Ingredient')

// @route       GET api/ingredients
// @desc        Get all users ingredients
// @access      Private
router.get('/', auth, async (req, res) => {
  try {
    const ingredients = await Ingredient.find({ user: req.user.id })
    res.json(ingredients)
  } catch (error) {
    console.error(error.messages)
    res.status(500).send('Server Error')
  }
})

// @route       POST api/ingredient
// @desc        Add new ingredient
// @access      Private
router.post(
  '/',
  [
    auth,
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, unit, category } = req.body

    try {
      const newIngredient = new Ingredient({
        name,
        unit,
        category,
        user: req.user.id,
      })

      const ingredient = await newIngredient.save()
      res.json(ingredient)
    } catch (error) {
      console.error(error.message)
      res.status(500).send({ msg: 'Server Error' })
    }
  }
)

// @route       PUT api/ingredient
// @desc        Edit an ingredient
// @access      Private
router.put('/:id', (req, res) => {
  res.send('Edit an ingredient')
})

// @route       DELETE api/ingredient
// @desc        Delete a ingredient
// @access      Private
router.delete('/:id', (req, res) => {
  res.send('Delete an ingredient')
})

module.exports = router
