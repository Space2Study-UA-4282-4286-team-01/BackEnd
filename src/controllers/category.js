const categoryService = require('~/services/category')

const getCategoryNames = async (req, res, next) => {
    try {
      const categoriesNames =
        await categoryService.getCategoryNames()
  
      res.status(200).json(categoriesNames)
    } catch (error) {
      next(error)
    }
  }

module.exports = {
    getCategoryNames
}