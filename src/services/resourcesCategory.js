const ResourcesCategory = require('~/models/resourcesCategory')
const { createForbiddenError } = require('~/utils/errorsHelper')

const resourcesCategoryService = {
  createResourcesCategory: async (author, data) => {
    const { name, appearance } = data
    const { color, icon } = appearance

    return await ResourcesCategory.create({
      name,
      appearance: { color, icon },
      author
    })
  },

  getResourcesCategories: async (match = {}, sort = {}, skip = 0, limit = 0) => {
    const items = await ResourcesCategory.find(match)
      .collation({ locale: 'en', strength: 1 })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec()
    const count = await ResourcesCategory.countDocuments(match)

    return { count, items }
  },
  getResourcesCategoriesNames: async (match = {}) => {
    return await ResourcesCategory.find(match).select('name').exec()
  },

  updateResourceCategory: async (id, currentUserId, updateData) => {
    const resourceCategory = await ResourcesCategory.findById(id).exec()

    const author = resourceCategory.author.toString()
    if (currentUserId !== author) {
      throw createForbiddenError()
    }

    for (let field in updateData) {
      resourceCategory[field] = updateData[field]
    }

    await resourceCategory.save()
  },

  deleteResourceCategory: async (id) => {
    await ResourcesCategory.findByIdAndRemove(id).exec()
  }
}

module.exports = resourcesCategoryService
