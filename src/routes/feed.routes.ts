import { FeedController } from '@/controllers/feed.controller'
import { FeedService } from '@/services/feed.service'
import { FilterService } from '@/services/filter.service'
import { Router } from 'express'

const router = Router()
const feedController = new FeedController(new FeedService(), new FilterService())

router.get('/', feedController.getFeeds.bind(feedController))
router.put('/', feedController.addFeed.bind(feedController))
router.get('/:id', feedController.getFeed.bind(feedController))
router.post('/:id', feedController.editFeed.bind(feedController))
router.delete('/:id', feedController.deleteFeed.bind(feedController))

export default router
