export function isEmptyString(str?: string | null) {
	return !str || str.trim() === ''
}

export function capitalize(str: string, index: number) {
	const minorWords = [
		'and',
		'of',
		'the',
		'in',
		'on',
		'at',
		'to',
		'for',
		'with',
		'a',
		'an',
	]
	if (index > 0 && minorWords.includes(str)) return str
	return str.charAt(0).toUpperCase() + str.slice(1)
}
