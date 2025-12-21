const getSortOptions = (sort) => {
  try {
    const { order = 'asc', orderBy = 'updatedAt' } = JSON.parse(sort)
    const sortField = orderBy === 'date' ? 'updatedAt' : orderBy
    return { [sortField]: order }
  } catch (error) {
    return { updatedAt: 'asc' }
  }
}

module.exports = getSortOptions
