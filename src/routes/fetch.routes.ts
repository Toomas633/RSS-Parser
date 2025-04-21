import { FetchController } from '@/controllers/fetch.controller'
import { FetchService } from '@/services/fetch.service'
import { Router } from 'express'

const router = Router()
const fetchController = new FetchController(new FetchService())

router.get('/', fetchController.fetch.bind(fetchController))
router.get('/:url', fetchController.testFetch.bind(fetchController))

export default router
