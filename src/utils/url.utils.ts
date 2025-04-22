import { Error } from '@/models/error.model'

export function validateUrl(url: string) {
	try {
		return new URL(url)
	} catch (e) {
		throw new Error(`Invalid URL: ${url}`, 400, e as string)
	}
}
