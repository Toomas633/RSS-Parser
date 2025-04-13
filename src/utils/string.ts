export function isEmptyString(str?: string | null) {
	return !str || str.trim() === ''
}
