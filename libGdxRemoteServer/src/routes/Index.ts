import Express from 'express'

const router = Express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.status(200).json('Server is running')
})

export default router
