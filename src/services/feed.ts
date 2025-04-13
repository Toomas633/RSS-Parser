import { Feed } from '@/models/feed'
import { validateFeed } from '@/utils/feed'
import * as fs from 'fs'
import * as path from 'path'

export class FeedService {
	private feeds: Array<Feed> = []

	private loadFeedsFromFile() {
		const filePath = path.resolve('conf/feeds.json')
		try {
			const data = fs.readFileSync(filePath, 'utf-8')
			this.feeds = JSON.parse(data) as Array<Feed>
		} catch (error) {
			console.error('Error loading feeds from file:', error)
		}
	}

	private addFeedsToFile() {
		const filePath = path.resolve('conf/feeds.json')
		try {
			const data = JSON.stringify(this.feeds, null, 2)
			fs.writeFileSync(filePath, data, 'utf-8')
		} catch (error) {
			console.error('Error loading feeds from file:', error)
		}
	}

	fetchFeeds() {
		this.loadFeedsFromFile()
		return this.feeds
	}

	addFeed(feed: Partial<Feed>[]) {
		validateFeed(feed)
		this.loadFeedsFromFile()
		for (const f of feed) {
			this.feeds.push({ id: this.feeds.length + 1, ...f } as Feed)
		}
		this.addFeedsToFile()
	}

	getFeed(feedId: number) {
		this.loadFeedsFromFile()
		return this.feeds.find((feed) => feed.id === feedId)
	}

	deleteFeed(feedId: number) {
		this.loadFeedsFromFile()
		this.feeds = this.feeds.filter((feed) => feed.id !== feedId)
		this.addFeedsToFile()
		return { message: 'Feed deleted successfully' }
	}

	editFeed(feedId: number, updatedFeed: Partial<Feed>) {
		validateFeed(updatedFeed)
		this.loadFeedsFromFile()
		const index = this.feeds.findIndex((feed) => feed.id === feedId)
		if (index !== -1) {
			this.feeds[index] = { ...this.feeds[index], ...updatedFeed } as Feed
			this.addFeedsToFile()
			return this.feeds[index]
		} else {
			return null
		}
	}
}
