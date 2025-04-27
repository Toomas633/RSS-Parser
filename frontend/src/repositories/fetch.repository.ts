import type { Filter } from '@/models/filter.model'
import { api } from '@/utils/axios/api'
import { handleAxiosError } from '@/utils/error'

export async function testFetch(
	url: string,
	tv?: boolean,
	filter?: Partial<Filter>
) {
	return api
		.post('/fetch/', { url, tv, filter })
		.then((response) => response.data)
		.catch((error) => {
			handleAxiosError(error)
			return null
		})
}
