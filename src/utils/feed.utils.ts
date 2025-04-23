import { Feed } from '@/models/feed.model'
import { isEmptyString } from './string.utils'
import * as fs from 'fs'
import * as path from 'path'
import { Error } from '@/models/error.model'

const filePath = path.resolve(__dirname, '../../data/feeds.json')

export function loadFeedsFromFile() {
	try {
		const data = fs.readFileSync(filePath, 'utf-8')
		return JSON.parse(data) as Feed[]
	} catch (error) {
		throw new Error(`Error reading feeds from file: ${error}`)
	}
}

export function addFeedsToFile(feeds: Feed[]) {
	try {
		const data = JSON.stringify(feeds, null, 2)
		fs.writeFileSync(filePath, data, 'utf-8')
	} catch (error) {
		throw new Error(`Error writing feeds to file: ${error}`)
	}
}

export function validateFeed(feed: Partial<Feed> | Partial<Feed>[]) {
	const requiredFields = ['name', 'url']
	if (Array.isArray(feed)) {
		feed.forEach((f) => validateFeed(f))
	} else {
		requiredFields.forEach((field) => {
			if (!(field in feed)) {
				throw new Error(`Missing required feed property: ${field}`, 400)
			}
			if (isEmptyString(feed[field as keyof Feed] as string | undefined)) {
				throw new Error(`Feed ${field} cannot be empty`, 400)
			}
		})

		for (const key in feed) {
			if (!requiredFields.includes(key)) {
				throw new Error(`Invalid feed property: ${key}`, 400)
			}
		}
	}
}
