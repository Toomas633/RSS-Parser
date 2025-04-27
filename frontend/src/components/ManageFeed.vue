<template>
	<v-container fluid>
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
			@valid="feedValid = $event"
			@feed="newFeed = $event"
			@addFilters="addFilters = $event"
			@queryType="queryType = $event" />
		<FeedFilters v-if="addFilters" @filter="filter = $event" />
		<div>
			<v-btn
				class="mt-1 mr-2"
				color="amber"
				prepend-icon="mdi-message-text-fast"
				:disabled="testLoading"
				:loading="testLoading"
				@click="test">
				Test
			</v-btn>
			<v-btn
				class="mt-1 ml-2"
				color="green"
				prepend-icon="mdi-plus"
				:disabled="loading"
				:loading="loading"
				@click="submit">
				Submit
			</v-btn>
		</div>
		<RssView v-if="testResponse" :rss="testResponse" />
	</v-container>
</template>

<script lang="ts" setup>
import { testFetch } from '@/repositories/fetch.repository'
import { computed, ref } from 'vue'
import FeedForm from '@/components/FeedForm.vue'
import type { Feed } from '@/models/feed.model'
import { QueryType } from '@/enums/queryType'
import type { Filter } from '@/models/filter.model'

const props = defineProps<{
	feed?: Feed
}>()

const loading = ref(false)
const testLoading = ref(false)
const testResponse = ref('')

const emit = defineEmits<(close: 'close') => void>()

const valid = computed(() => {
	return feedValid.value && validateFilters()
})

const newFeed = ref<Feed>({
	name: '',
	url: '',
	tv: false,
})
const feedValid = ref(false)
const addFilters = ref(false)
const queryType = ref<QueryType>(QueryType.None)
const filter = ref<Filter>({
	showName: '',
	seasonStart: 0,
	episodeStart: 0,
	exclude: [],
})

async function test() {
	if (valid.value) {
		testLoading.value = true
		testResponse.value = await testFetch(
			newFeed.value.url,
			newFeed.value.tv,
			addFilters.value ? filter.value : undefined
		)
			.then((response) => {
				return response as string
			})
			.finally(() => (testLoading.value = false))
	}
}

async function submit() {
	const feed = {
		name: FeedForm.name,
		url: FeedForm.url,
		tv: FeedForm.tv,
	}
	if (valid.value) {
		testLoading.value = true

		// TODO emit('close')
	}
	loading.value = false
}

function validateFilters() {
	console.log(filter.value)
	if (!addFilters.value) {
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
</script>
