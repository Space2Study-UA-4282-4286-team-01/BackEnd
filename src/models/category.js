const { Schema, model } = require('mongoose')
const { CATEGORY } = require('~/consts/models')
const {
    FIELD_CANNOT_BE_EMPTY,
    FIELD_CANNOT_BE_LONGER,
    FIELD_CANNOT_BE_SHORTER,
    FIELD_IS_NOT_OF_PROPER_FORMAT
  } = require('~/consts/errors')
  const color = require('~/consts/resourcesCategory')
  const colorValidation = FIELD_IS_NOT_OF_PROPER_FORMAT('color')

  const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, FIELD_CANNOT_BE_EMPTY('name')],
            minLength: [1, FIELD_CANNOT_BE_SHORTER('name', 1)],
            maxLength: [50, FIELD_CANNOT_BE_LONGER('name', 50)],
            unique: true
        },
        appearance: {
            icon: {
              type: String,
              required: [true, FIELD_CANNOT_BE_EMPTY('icon')],
              default: 'Language'
            },
            color: {
              type: String,
              default: color.DEFAULT,
              required: [true, FIELD_CANNOT_BE_EMPTY('color')],
              validate: {
                validator: value => colorValidation.regex.test(value),
                message: colorValidation.message
              }
            }
          },
          totalOffers: {
            student: {
              type: Number,
              default: 0
            },
            tutor: {
              type: Number,
              default: 0
            }
          }

    },
    {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
    }
  )


  module.exports = model(CATEGORY, categorySchema)