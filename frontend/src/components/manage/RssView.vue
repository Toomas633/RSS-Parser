<template>
	<v-row class="mt-2">
		<v-col cols="10">
			<div class="position-relative">
				<div
					class="search-bar align-center d-flex justify-end position-absolute pr-4">
					<v-text-field
						v-model="search"
						label="Find"
						density="compact"
						hide-details
						clearable
						prepend-inner-icon="mdi-magnify"
						color="primary"
						width="200"
						@keydown.enter="findNext" />
					<v-btn
						icon
						size="small"
						variant="text"
						@click="findPrev"
						:disabled="!search">
						<v-icon>mdi-chevron-up</v-icon>
					</v-btn>
					<v-btn
						icon
						size="small"
						variant="text"
						@click="findNext"
						:disabled="!search">
						<v-icon>mdi-chevron-down</v-icon>
					</v-btn>
					<span v-if="search && matches.length" class="ml-2">
						{{ currentIndex + 1 }} / {{ matches.length }}
					</span>
				</div>
				<div
					class="formatted-xml position-relative pa-2 overflow-auto"
					v-html="highlightedRss"></div>
			</div>
		</v-col>
		<v-col cols="2">
			<v-card class="px-4 pb-4">
				<v-card-title class="ml-n4">
					<v-icon size="24" class="pb-1">mdi-filter</v-icon>Filters
				</v-card-title>
				<v-btn
					prepend-icon="mdi-restore"
					class="ml-1"
					color="primary"
					@click="resetFilters()">
					Reset filters
				</v-btn>
				<v-checkbox
					v-model="metadata"
					density="compact"
					label="Metadata"
					color="primary"
					hint="Feed metadata like RSS version and feed title, description, etc. (Remove to keep only items)"
					persistent-hint />
				<v-checkbox
					v-model="title"
					density="compact"
					label="Title"
					color="primary"
					hint="Show title tags of items"
					persistent-hint />
				<v-checkbox
					v-model="showName"
					density="compact"
					label="Show name"
					color="primary"
					hint="Show description tags of items"
					persistent-hint />
				<v-checkbox
					v-model="link"
					density="compact"
					label="Link"
					color="primary"
					hint="Show link tags of items"
					persistent-hint />
				<v-checkbox
					v-model="pubDate"
					density="compact"
					label="Pub Date"
					color="primary"
					hint="Show pubDate tags of items"
					persistent-hint />
				<v-checkbox
					v-model="season"
					density="compact"
					label="Season"
					color="primary"
					hint="Show season tags of items"
					persistent-hint />
				<v-checkbox
					v-model="episode"
					density="compact"
					label="Episode"
					color="primary"
					hint="Show episode tags of items"
					persistent-hint />
			</v-card>
		</v-col>
	</v-row>
</template>
<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import xmlFormatter, { type XMLFormatterOptions } from 'xml-formatter'

const props = defineProps<{
	rss: string
}>()

const formattedRss = ref('')
const search = ref('')
const matches = ref<number[]>([])
const currentIndex = ref(0)
const metadata = ref(true)
const title = ref(true)
const showName = ref(true)
const link = ref(true)
const pubDate = ref(true)
const season = ref(true)
const episode = ref(true)

const highlightedRss = computed(() => {
	if (!search.value) return escapeHtml(formattedRss.value)
	const regex = new RegExp(escapeRegExp(search.value), 'gi')
	let idx = 0
	matches.value = []
	const html = escapeHtml(formattedRss.value).replace(regex, (match) => {
		matches.value.push(idx++)
		const className =
			idx - 1 === currentIndex.value ? 'highlight current' : 'highlight'
		return `<mark class="${className}">${match}</mark>`
	})
	return html
})

watch(search, () => {
	currentIndex.value = 0
	nextTick(scrollToCurrent)
})

watch(
	() => props.rss,
	() => {
		formattedRss.value = formatXml(props.rss)
	},
	{ immediate: true }
)

watch(
	() => [
		metadata.value,
		title.value,
		showName.value,
		link.value,
		pubDate.value,
		season.value,
		episode.value,
	],
	() => {
		filterRss()
	}
)

function findNext() {
	if (!matches.value.length) return
	currentIndex.value = (currentIndex.value + 1) % matches.value.length
	scrollToCurrent()
}

function findPrev() {
	if (!matches.value.length) return
	currentIndex.value =
		(currentIndex.value - 1 + matches.value.length) % matches.value.length
	scrollToCurrent()
}

function scrollToCurrent() {
	nextTick(() => {
		const el = document.querySelector('.highlight.current')
		if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
	})
}

function escapeHtml(str: string) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
}

function escapeRegExp(str: string) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function resetFilters() {
	metadata.value = true
	title.value = true
	showName.value = true
	link.value = true
	pubDate.value = true
	season.value = true
	episode.value = true
}

function filterRss() {
	let rss = formatXml(props.rss)
	if (!metadata.value) {
		rss = rss.match(/<item[\s\S]*?<\/item>/g)?.join('\n') ?? ''
	}
	if (!title.value) {
		rss = rss.replace(/^[ \t]*<title[\s\S]*?<\/title>[ \t]*\r?\n?/gm, '')
		rss = rss.replace(/<title[\s\S]*?<\/title>/g, '')
	}
	if (!showName.value) {
		rss = rss.replace(
			/^[ \t]*<show_name[\s\S]*?<\/show_name>[ \t]*\r?\n?/gm,
			''
		)
		rss = rss.replace(/<show_name[\s\S]*?<\/show_name>/g, '')
	}
	if (!link.value) {
		rss = rss.replace(/^[ \t]*<link[\s\S]*?<\/link>[ \t]*\r?\n?/gm, '')
		rss = rss.replace(/<link[\s\S]*?<\/link>/g, '')
	}
	if (!pubDate.value) {
		rss = rss.replace(/^[ \t]*<pubDate[\s\S]*?<\/pubDate>[ \t]*\r?\n?/gm, '')
		rss = rss.replace(/<pubDate[\s\S]*?<\/pubDate>/g, '')
	}
	if (!season.value) {
		rss = rss.replace(/^[ \t]*<season[\s\S]*?<\/season>[ \t]*\r?\n?/gm, '')
		rss = rss.replace(/<season[\s\S]*?<\/season>/g, '')
	}
	if (!episode.value) {
		rss = rss.replace(/^[ \t]*<episode[\s\S]*?<\/episode>[ \t]*\r?\n?/gm, '')
		rss = rss.replace(/<episode[\s\S]*?<\/episode>/g, '')
	}
	rss = rss.replace(/^\s*[\r\n]/gm, '')
	formattedRss.value = rss
}

function formatXml(xml: string) {
	try {
		const options: XMLFormatterOptions = {
			collapseContent: true,
			lineSeparator: '\n',
			indentation: '  ',
		}
		return xmlFormatter(xml, options)
	} catch (error) {
		console.error('Error formatting RSS:', error)
		return 'Invalid RSS format'
	}
}
</script>
<style scoped>
.formatted-xml {
	background: rgb(var(--v-theme-surface));
	font-family: 'Fira Mono', 'Consolas', monospace;
	font-size: 0.95rem;
	border-radius: 0.25rem;
	max-height: 37.5rem;
	white-space: pre;
}
.search-bar {
	top: 0.75rem;
	right: 1rem;
	z-index: 2;
	gap: 0.25rem;
	background: rgba(var(--v-theme-surface), 0.9);
}
</style>
