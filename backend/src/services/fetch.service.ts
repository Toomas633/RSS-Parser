import { RssItem } from '@/models/rss.model'
import { loadFeedsFromFile } from '@/utils/feed.utils'
import { capitalize } from '@/utils/string.utils'
import { validateUrl } from '@/utils/url.utils'
import { escapeXml } from '@/utils/xml.utils'
import { parseStringPromise } from 'xml2js'
import { Error } from '@/models/error.model'
import { filter } from '@/utils/filter.utils'

export class FetchService {
	async fetch() {
		const feeds = loadFeedsFromFile()

		if (!feeds || feeds.length === 0) {
			return { message: 'No feeds available' }
		}

		const results: RssItem[] = []

		for (const feed of feeds) {
			try {
				const response = await fetch(feed.url)
				if (!response.ok) {
					console.error(`Failed to fetch ${feed.url}: ${response.statusText}`)
					continue
				}

				const data = await this.prettifyResponse(response, feed.tv)
				results.push(...filter(feed.id, data))
			} catch (error) {
				throw new Error(`Error fetching feed ${feed.url}`, 500, error as string)
			}
		}

		return this.turnToRssFeed(results)
	}

	private async prettifyResponse(
		response: Response,
		filter = false
	): Promise<RssItem[]> {
		const xmlData = await response.text()
		const parsedData = await parseStringPromise(xmlData)

		let data: RssItem[] = parsedData.rss?.channel?.[0]?.item

		if (!data) return []

		if (filter) {
			data = data.filter((item) => /S\d{2}E\d{2}/i.test(item.title))
		}

		return data.map((item) => {
			const title = item.title[0].replace(/\./g, ' ')
			const match = RegExp(/^(.*?)(?:\s*S(\d{2})E(\d{2}))/i).exec(title)
			if (!match?.length) {
				return {
					title,
					link: item.link[0],
					pubDate: item.pubDate[0],
				} as RssItem
			}
			const showName = match[1]
				.trim()
				.toLowerCase()
				.split(' ')
				.map((word, index) => capitalize(word, index))
				.join(' ')
			const season = match[2]
			const episode = match[3]

			const updatedTitle = `${showName} S${season}E${episode}${title.slice(match[0].length)}`

			return {
				title: updatedTitle,
				showName,
				link: item.link[0],
				pubDate: item.pubDate[0],
				season: parseInt(season, 10),
				episode: parseInt(episode, 10),
			} as RssItem
		})
	}

	private turnToRssFeed(data: RssItem[]) {
		const rssItems = data
			.map(
				(item) => `
            <item>
                <title>${escapeXml(item.title)}</title>
                <show_name>${escapeXml(item.showName)}</show_name>
                <link>${escapeXml(item.link)}</link>
                <pubDate>${escapeXml(item.pubDate)}</pubDate>
				<season>${escapeXml(item.season.toString())}</season>
				<episode>${escapeXml(item.episode.toString())}</episode>
            </item>
        `
			)
			.join('')

		const rssFeed = `
            <?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
                <channel>
                    <title>RSS Feed</title>
                    <description>RSS feed from RSS parser</description>
                    <link>http://localhost</link>
                    <length>${data.length}</length>
                    ${rssItems}
                </channel>
            </rss>
        `

		return rssFeed.trim()
	}

	async testFetch(url: string) {
		validateUrl(url)

		try {
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
			}

			const data = await this.prettifyResponse(response)

			return this.turnToRssFeed(data)
		} catch (error) {
			throw new Error(`Error fetching feed ${url}`, 500, error as string)
		}
	}
}
