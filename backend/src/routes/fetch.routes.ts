import { FetchController } from '@/controllers/fetch.controller'
import { FetchService } from '@/services/fetch.service'
import { Router } from 'express'

const router = Router()
const fetchController = new FetchController(new FetchService())

router.get('/', fetchController.fetch.bind(fetchController))
router.post('/', fetchController.testFetch.bind(fetchController))

export default router
