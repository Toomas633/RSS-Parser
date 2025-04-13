import { Feed } from '@/models/feed'
import { isEmptyString } from './string'
import * as fs from 'fs'
import * as path from 'path'

export function loadFeedsFromFile() {
	const filePath = path.resolve('conf/feeds.json')
	try {
		const data = fs.readFileSync(filePath, 'utf-8')
		return JSON.parse(data) as Feed[]
	} catch (error) {
		throw new Error(`Error reading feeds from file: ${error}`)
	}
}

export function addFeedsToFile(feeds: Feed[]) {
	const filePath = path.resolve('conf/feeds.json')
	try {
		const data = JSON.stringify(feeds, null, 2)
		fs.writeFileSync(filePath, data, 'utf-8')
	} catch (error) {
		throw new Error(`Error writing feeds to file: ${error}`)
	}
}

export function validateFeed(feed: Partial<Feed> | Partial<Feed>[]) {
	if (Array.isArray(feed)) {
		feed.forEach((f) => validateFeed(f))
	} else {
		for (const key in feed) {
			if (key !== 'name' && key !== 'url') {
				throw new Error(`Invalid feed property: ${key}`)
			}
			if (isEmptyString(feed[key])) {
				throw new Error(`Feed ${key} cannot be empty`)
			}
		}
	}
}
