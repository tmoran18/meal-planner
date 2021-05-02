const mongoose = require('mongoose')

const MealSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  name: {
    type: String,
    required: true,
  },
  secondary_name: {
    type: String,
    required: true,
  },
  image_URL: {
    type: String,
    required: true,
  },
  image_ID: {
    type: String,
    required: true,
  },
  ingredients: {
    type: Array,
    required: true,
  },
  steps: {
    type: Array,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('meal', MealSchema)
