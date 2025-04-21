import { Router } from 'express'
import feedRoutes from './feed.routes'
import fetchRoutes from './fetch.routes'

const routes = Router()

routes.use('/feeds', feedRoutes)
routes.use('/fetch', fetchRoutes)

export default routes
