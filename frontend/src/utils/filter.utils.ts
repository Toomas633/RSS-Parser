import type { Filter } from '../models/filter.model'

export function formatFilter(filter: Filter) {
	return {
		feedId: filter.feedId,
		exclude: filter.exclude?.length ? filter.exclude : undefined,
		seasonStart: filter.seasonStart !== 0 ? filter.seasonStart : undefined,
		episodeStart: filter.episodeStart !== 0 ? filter.episodeStart : undefined,
		showName: filter.showName?.length ? filter.showName : undefined,
	}
}
