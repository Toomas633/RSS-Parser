export function validateUrl(url: string) {
	try {
		new URL(url)
		return true
	} catch (e) {
		return false
	}
}
