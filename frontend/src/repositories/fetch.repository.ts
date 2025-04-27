import { api } from '@/utils/axios/api'
import { handleAxiosError } from '@/utils/error'

export async function testFetch(url: string) {
	return api
		.post('/fetch/', { url })
		.then((response) => response.data)
		.catch((error) => handleAxiosError(error))
}
