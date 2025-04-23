import * as fs from 'fs'
import * as path from 'path'

const dataFolder = path.resolve(__dirname, '..', 'data')
const feedsFile = path.resolve(dataFolder, 'feeds.json')
const filtersFile = path.resolve(dataFolder, 'filters.json')

export function initDataFolder() {
	if (!fs.existsSync(dataFolder)) {
		fs.mkdirSync(dataFolder)
	}

	if (!fs.existsSync(feedsFile)) {
		fs.writeFileSync(feedsFile, JSON.stringify([], null, 2))
	}

	if (!fs.existsSync(filtersFile)) {
		fs.writeFileSync(filtersFile, JSON.stringify([], null, 2))
	}
}
