import { Router } from 'express'
import feedRoutes from './feedRoutes'
import fetchRoutes from './fetchRoutes'

const routes = Router()

routes.use('/feeds', feedRoutes)
routes.use('/fetch', fetchRoutes)

export default routes
