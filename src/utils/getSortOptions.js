const getSortOptions = (sort) => {
  try {
    const { order = 'asc', orderBy } = JSON.parse(sort)

    let sortField = 'updatedAt'

    if (orderBy === 'date') {
      sortField = 'updatedAt'
    } else if (orderBy) {
      sortField = orderBy
    }

    return { [sortField]: order }
  } catch (error) {
    return { updatedAt: 'asc' }
  }
}

module.exports = getSortOptions
