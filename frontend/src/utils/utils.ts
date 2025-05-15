export function isEmpty(value: unknown): boolean {
	if (!value) return true
	if (typeof value === 'string') {
		return value.trim() === ''
	}
	return false
}
