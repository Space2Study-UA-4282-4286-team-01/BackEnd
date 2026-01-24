const Category = require('~/models/category')

const getCategoryNames = async () => {
  const categories = await Category.find(
    {},
    { name: 1 } 
  ).lean()

  return categories.map(category => ({
    id: category._id.toString(),
    name: category.name
  }))
}

module.exports = {
  getCategoryNames
}
