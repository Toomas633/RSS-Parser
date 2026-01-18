import type { Filter } from '../models/filter.model'
import { api } from '../utils/axios/api'
import { handleAxiosError } from '../utils/error'

export async function addFilter(filter: Filter) {
	return api
		.put('/filter', filter)
		.then((response) => response.data)
		.catch((error) => handleAxiosError(error))
}

export async function getFilter(feedId: number) {
	return api
		.get(`/filter/${feedId}`)
		.then((response) => response.data)
		.catch((error) => handleAxiosError(error))
}

export async function updateFilter(feedId: number, filter: Filter) {
	return api
		.post(`/filter/${feedId}`, filter)
		.then((response) => response.data)
		.catch((error) => handleAxiosError(error))
}

export async function deleteFilter(feedId: number) {
	return api
		.delete(`/filter/${feedId}`)
		.then((response) => response.data)
		.catch((error) => handleAxiosError(error))
}
