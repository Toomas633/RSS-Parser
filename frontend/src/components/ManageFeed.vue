<template>
	<v-container fluid class="manage-feed">
		<span class="d-flex justify-space-between align-center">
			<h2 v-if="feed?.id" class="ml-n2 mb-2 align-center">
				<v-icon size="29">mdi-pencil</v-icon>Edit Feed
			</h2>
			<h2 v-else class="ml-n2 mb-2 align-center">
				<v-icon size="29">mdi-plus</v-icon>Add Feed
			</h2>
			<v-btn variant="plain" icon="mdi-close" @click="emit('close')" />
		</span>
		<FeedForm
			:feed="feed"
			:filters="!!filter"
			@valid="feedValid = $event"
			@feed="newFeed = $event"
			@addFilters="addFilters = $event"
			@queryType="queryType = $event" />
		<FeedFilters v-if="addFilters" :filter="filter" @filter="filter = $event" />
		<v-btn
			class="mt-4 mr-2"
			color="primary"
			variant="outlined"
			prepend-icon="mdi-message-text-fast"
			:disabled="testLoading"
			:loading="testLoading"
			@click="test">
			Test
		</v-btn>
		<v-btn
			class="mt-4 ml-2"
			color="green"
			prepend-icon="mdi-plus"
			:disabled="loading"
			:loading="loading"
			@click="submit">
			Submit
		</v-btn>
		<v-chip
			class="ml-4 mt-4"
			variant="outlined"
			color="primary"
			style="width: 5rem"
			prepend-icon="mdi-clock-time-four-outline"
			v-if="testTimer">
			{{ testTimer / 1000 }}s
		</v-chip>
		<RssView v-if="testResponse" :rss="testResponse" />
	</v-container>
</template>

<script lang="ts" setup>
import { testFetch } from '@/repositories/fetch.repository'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Feed } from '@/models/feed.model'
import { QueryType } from '@/enums/queryType'
import type { Filter } from '@/models/filter.model'
import { addFeed, updateFeed } from '@/repositories/feed.repository'
import {
	addFilter,
	deleteFilter,
	getFilter,
	updateFilter,
} from '@/repositories/filter.repository'

const props = defineProps<{
	feed?: Feed
}>()

const loading = ref(false)
const testLoading = ref(false)
const testResponse = ref('')
const hadFilter = ref(false)
const testTimer = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null
const newFeed = ref<Feed>({
	id: 0,
	name: '',
	url: '',
	tv: false,
})
const feedValid = ref(false)
const addFilters = ref(false)
const queryType = ref<QueryType>(QueryType.None)
const filter = ref<Filter | undefined>({
	showName: '',
	seasonStart: 0,
	episodeStart: 0,
	exclude: [],
})

const emit = defineEmits<(close: 'close') => void>()

const valid = computed(() => {
	return feedValid.value && validateFilters()
})

watch(testLoading, (val) => {
	if (val) {
		testTimer.value = 0
		timerInterval = setInterval(() => {
			testTimer.value += 10
		}, 10)
	} else if (timerInterval) {
		clearInterval(timerInterval)
		timerInterval = null
	}
})

watch(
	() => props.feed,
	async () => {
		reset()
		if (props.feed?.id) {
			const f = await getFilter(props.feed.id)
			filter.value = f
			addFilters.value = !!f
			hadFilter.value = !!f
		} else {
			hadFilter.value = false
		}
	}
)

onMounted(async () => {
	if (props.feed) {
		newFeed.value = props.feed
		const f = await getFilter(props.feed.id)
		filter.value = f
		addFilters.value = !!f
		hadFilter.value = !!f
	}
})

async function test() {
	testResponse.value = ''
	if (valid.value) {
		testLoading.value = true
		testResponse.value = await testFetch(
			newFeed.value.url,
			newFeed.value.tv,
			addFilters.value ? filter.value : undefined
		)
			.then((response) => {
				if (testLoading.value) {
					return response as string
				}
				return ''
			})
			.finally(() => (testLoading.value = false))
	}
}

async function submit() {
	const feed: Feed = {
		...props.feed,
		...newFeed.value,
	}
	if (valid.value) {
		loading.value = true
		if (props.feed?.id) {
			await update(feed).finally(() => (loading.value = false))
		} else {
			await addNew(feed).finally(() => (loading.value = false))
		}
	}
	loading.value = false
	emit('close')
}

async function update(feed: Feed) {
	await updateFeed(feed.id, feed)
	if (addFilters.value && filter.value) {
		if (hadFilter.value) {
			await updateFilter(feed.id, filter.value)
		} else {
			await addFilter({
				...filter.value,
				feedId: feed.id,
			})
		}
	}
	if (!addFilters.value && hadFilter.value) {
		await deleteFilter(feed.id)
	}
}

async function addNew(feed: Feed) {
	await addFeed({ ...feed, id: undefined }).then(async (addedFeed) => {
		if (filter.value) {
			await addFilter({
				feedId: addedFeed.id,
				...filter.value,
			})
		}
	})
}

function validateFilters() {
	if (!addFilters.value || !filter.value) {
		return true
	}
	const f = filter.value
	return (
		!!f.showName ||
		!!f.seasonStart ||
		!!f.episodeStart ||
		(Array.isArray(f.exclude) && f.exclude.length > 0)
	)
}

function reset() {
	filter.value = undefined
	hadFilter.value = false
	addFilters.value = false
	testResponse.value = ''
	testLoading.value = false
	if (timerInterval) {
		clearInterval(timerInterval)
	}
	testTimer.value = 0
}

onUnmounted(() => {
	reset()
})
</script>
<style scoped>
.manage-feed {
	width: calc(100% - 250px);
}
</style>
