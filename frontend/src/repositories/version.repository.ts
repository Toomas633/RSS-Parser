import { repo } from '../utils/axios/repo'
import { handleAxiosError } from '../utils/error'

export async function getVersion() {
	return repo
		.get('/version')
		.then((response) => response.data)
		.catch((error) => handleAxiosError(error))
}
