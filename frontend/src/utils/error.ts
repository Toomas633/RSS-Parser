import type { AxiosError } from 'axios'

export function handleAxiosError(error: AxiosError) {
	console.error(error)
}
