import { FetchController } from '@/controllers/fetch'
import { FetchService } from '@/services/fetch'
import { Router } from 'express'

const router = Router()
const fetchController = new FetchController(new FetchService())

router.get('/', fetchController.fetch.bind(fetchController))
router.get('/:url', fetchController.testFetch.bind(fetchController))

export default router
