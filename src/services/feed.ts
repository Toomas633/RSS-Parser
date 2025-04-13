import { Feed } from '@/models/feed'
import { addFeedsToFile, loadFeedsFromFile, validateFeed } from '@/utils/feed'

export class FeedService {
	fetchFeeds() {
		return loadFeedsFromFile()
	}

	addFeed(feed: Partial<Feed>[]) {
		validateFeed(feed)
		const feeds = loadFeedsFromFile()
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
		if (index !== -1) {
			feeds[index] = { ...feeds[index], ...updatedFeed } as Feed
			addFeedsToFile(feeds)
			return feeds[index]
		} else {
			return null
		}
	}
}
