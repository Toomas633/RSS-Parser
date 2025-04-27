import type { Feed } from '@/models/feed.model'
import { api } from '@/utils/axios/api'
import { handleAxiosError } from '@/utils/error'

export async function getFeeds() {
	return api
		.get('/feeds')
		.then((response) => response.data as Feed[])
		.catch((error) => {
			handleAxiosError(error)
			return [] as Feed[]
		})
}

export async function addFeed(feed: Feed) {
	return api
		.put('/feeds', feed)
		.then((response) => response.data)
		.catch((error) => handleAxiosError(error))
}

export async function getFeedById(id: number) {
	return api
		.get(`/feeds/${id}`)
		.then((response) => response.data)
		.catch((error) => handleAxiosError(error))
}

export async function updateFeed(id: number, feed: Feed) {
	return api
		.post(`/feeds/${id}`, feed)
		.then((response) => response.data)
		.catch((error) => handleAxiosError(error))
}

export async function deleteFeed(id: number) {
	return api
		.delete(`/feeds/${id}`)
		.then((response) => response.data)
		.catch((error) => handleAxiosError(error))
}
