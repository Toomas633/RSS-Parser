import { Filter } from '@/models/filter.model'
import {
	addFiltersToFile,
	loadFiltersFromFile,
	validateFilter,
} from '@/utils/filter.utils'
import { Error } from '@/models/error.model'

export class FilterService {
	getFilters(feedId?: number) {
		return loadFiltersFromFile(feedId)
	}

	addFilter(filter: Partial<Filter>) {
		if (filter.feedId === undefined) {
			throw new Error('Feed ID is required to add a filter', 400)
		}
		validateFilter(filter)
		const filters = loadFiltersFromFile()
		filters.push({ ...filter } as Filter)
		addFiltersToFile(filters)
	}

	deleteFilter(feedId: number) {
		const filters = loadFiltersFromFile()
		addFiltersToFile(filters.filter((filter) => filter.feedId !== feedId))
		return { message: 'Feed deleted successfully' }
	}

	editFilter(feedId: number, updatedFilter: Partial<Filter>) {
		validateFilter(updatedFilter)
		const filters = loadFiltersFromFile()
		const index = filters.findIndex((filter) => filter.feedId === feedId)
		if (index !== -1) {
			filters[index] = { ...filters[index], ...updatedFilter } as Filter
			addFiltersToFile(filters)
			return filters[index]
		} else {
			return null
		}
	}
}
