<template>
	<div class="position-relative mt-4">
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
</template>
<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import xmlFormatter from 'xml-formatter'

const props = defineProps<{
	rss: string
}>()

const formattedRss = computed(() => {
	try {
		return xmlFormatter(props.rss)
	} catch (error) {
		console.error('Error formatting RSS:', error)
		return 'Invalid RSS format'
	}
})

const search = ref('')
const matches = ref<number[]>([])
const currentIndex = ref(0)

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
watch(search, () => {
	currentIndex.value = 0
	nextTick(scrollToCurrent)
})

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
