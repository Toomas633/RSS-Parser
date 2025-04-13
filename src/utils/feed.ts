import { Feed } from '@/models/feed'
import { isEmptyString } from './string'

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
