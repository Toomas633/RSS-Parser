import { Request, Response } from 'express'
import { FeedService } from '@/services/feed'

export class FeedController {
	constructor(private readonly feedService: FeedService) {}

	public getFeeds(_req: Request, res: Response) {
		res.send(this.feedService.fetchFeeds())
	}

	public addFeed(req: Request, res: Response) {
		res.send(this.feedService.addFeed(req.body))
	}

	public getFeed(req: Request, res: Response) {
		const feedId = parseInt(req.params.id, 10)
		const feed = this.feedService.getFeed(feedId)

		if (feed) {
			res.status(200).send(feed)
		} else {
			res.status(404).send({ message: 'Feed not found' })
		}
	}

	public deleteFeed(req: Request, res: Response) {
		const feedId = parseInt(req.params.id, 10)
		res.send(this.feedService.deleteFeed(feedId))
	}

	public editFeed(req: Request, res: Response) {
		const feedId = parseInt(req.params.id, 10)
		const updatedFeed = this.feedService.editFeed(feedId, req.body)

		if (updatedFeed) {
			res.status(200).send(updatedFeed)
		} else {
			res.status(404).send({ message: 'Feed not found' })
		}
	}
}
