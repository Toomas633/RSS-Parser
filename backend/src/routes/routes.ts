import { Router } from 'express'
import feedRoutes from './feed.routes'
import fetchRoutes from './fetch.routes'
import filterRoutes from './filter.routes'

const routes = Router()

routes.use('/feeds', feedRoutes)
routes.use('/fetch', fetchRoutes)
routes.use('/filter', filterRoutes)

export default routes
