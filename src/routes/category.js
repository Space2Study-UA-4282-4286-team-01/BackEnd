const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')
const categoryController = require('~/controllers/category')
const {
  roles: { TUTOR, STUDENT }
} = require('~/consts/auth')

router.use(authMiddleware)

router.get(
  '/names',
  restrictTo(TUTOR, STUDENT),
  asyncWrapper(categoryController.getCategoryNames)
)


module.exports = router