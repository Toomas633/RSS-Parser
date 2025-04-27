import { Error } from '@/models/error.model'
import { Feed } from '@/models/feed.model'
import {
	addFeedsToFile,
	loadFeedsFromFile,
	validateFeed,
} from '@/utils/feed.utils'

export class FeedService {
	fetchFeeds() {
		return loadFeedsFromFile()
	}

	addFeed(feed: Partial<Feed>[] | Partial<Feed>) {
		validateFeed(feed)
		const feeds = loadFeedsFromFile()
		if (!Array.isArray(feed)) {
			feed = [feed]
		}
		for (const f of feed) {
			feeds.push({ id: feeds.length + 1, ...f } as Feed)
		}
		addFeedsToFile(feeds)
	}

	getFeed(feedId: number) {
		const feeds = loadFeedsFromFile()
		return feeds.find((feed) => feed.id === feedId)
	}

	deleteFeed(feedId: number) {
		const feeds = loadFeedsFromFile()
		addFeedsToFile(feeds.filter((feed) => feed.id !== feedId))
		return { message: 'Feed deleted successfully' }
	}

	editFeed(feedId: number, updatedFeed: Partial<Feed>) {
		validateFeed(updatedFeed)
		const feeds = loadFeedsFromFile()
		const index = feeds.findIndex((feed) => feed.id === feedId)

		if (index === -1) {
			throw new Error('Feed not found', 404)
		}

		feeds[index] = { ...feeds[index], ...updatedFeed } as Feed
		addFeedsToFile(feeds)
		return feeds[index]
	}
}
