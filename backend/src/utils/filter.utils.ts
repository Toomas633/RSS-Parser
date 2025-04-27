import path from 'path'
import * as fs from 'fs'
import { Filter } from '@/models/filter.model'
import { Error } from '@/models/error.model'
import { RssItem } from '@/models/rss.model'

const filePath = path.resolve(__dirname, '../../..', 'data/filters.json')

export function loadFiltersFromFile(feedId?: number) {
	try {
		const data = fs.readFileSync(filePath, 'utf-8')
		const filters = JSON.parse(data) as Filter[]
		if (!feedId) return filters
		return filters.filter((filter) => filter.feedId === feedId)
	} catch (error) {
		throw new Error(`Error reading feeds from file: ${error}`)
	}
}

export function addFiltersToFile(filters: Filter[]) {
	try {
		const data = JSON.stringify(filters, null, 2)
		fs.writeFileSync(filePath, data, 'utf-8')
	} catch (error) {
		throw new Error(`Error writing feeds to file: ${error}`)
	}
}

export function validateFilter(filter: Partial<Filter>) {
	if (!filter || typeof filter !== 'object') {
		throw new Error('Invalid filter: filter must be a non-null object.', 400)
	}

	const hasValidField = Object.keys(filter).some(
		(key) => key !== 'feedId' && filter[key as keyof Filter] !== undefined
	)

	if (!hasValidField) {
		throw new Error('Invalid filter: at least one field must be defined.', 400)
	}
}

export function filter(feedId: number, rssItems: RssItem[]) {
	const filter = loadFiltersFromFile(feedId)
	if (!filter.length) return rssItems

	return rssItems.filter((item) => {
		const { exclude, seasonStart, episodeStart, showName } = filter[0]
		const isExcluded =
			exclude?.some((exclusion) => item.title.includes(exclusion)) ?? false
		const isSeasonValid = item.season ?? 0 >= (seasonStart ?? 0)
		const isEpisodeValid = item.episode ?? 0 >= (episodeStart ?? 0)
		const isNameValid = showName ? showName === item.showName : true
		return !isExcluded && isSeasonValid && isEpisodeValid && isNameValid
	})
}

export function testFilter(rssItems: RssItem[], filter?: Filter) {
	if (!filter) return rssItems

	return rssItems.filter((item) => {
		const { exclude, seasonStart, episodeStart, showName } = filter
		const isExcluded =
			exclude?.some((exclusion) => item.title.includes(exclusion)) ?? false
		const isSeasonValid = item.season ?? 0 >= (seasonStart ?? 0)
		const isEpisodeValid = item.episode ?? 0 >= (episodeStart ?? 0)
		const isNameValid = showName ? showName === item.showName : true
		return !isExcluded && isSeasonValid && isEpisodeValid && isNameValid
	})
}
