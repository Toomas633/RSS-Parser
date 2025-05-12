<template>
	<div class="d-flex">
		<FeedList
			:feeds="feeds"
			:loading="feedsLoading"
			@edit="changeForm($event)"
			@add="changeForm"
			@delete="deleteFeedById($event)" />
		<ManageFeed v-if="show" :feed="selected" @close="closeForm()" />
		<v-container v-else />
	</div>
</template>
<script lang="ts" setup>
import type { Feed } from '@/models/feed.model'
import { deleteFeed, getFeeds } from '@/repositories/feed.repository'
import { deleteFilter } from '@/repositories/filter.repository'
import { onMounted, onUnmounted, ref } from 'vue'

const feeds = ref<Feed[]>([])
const selected = ref<Feed | undefined>(undefined)
const show = ref(false)
const feedsLoading = ref(false)

const updateInterval = 10000 // 10 seconds

const fetchFeeds = async () => {
	feedsLoading.value = true
	await getFeeds()
		.then((data) => {
			feeds.value = data as Feed[]
		})
		.finally(() => {
			feedsLoading.value = false
		})
}

onMounted(async () => {
	fetchFeeds()
	const interval = setInterval(fetchFeeds, updateInterval)

	onUnmounted(() => {
		clearInterval(interval)
	})
})

function closeForm() {
	fetchFeeds()
	selected.value = undefined
	show.value = false
}

function changeForm(feed?: Feed) {
	if (feed) {
		selected.value = feed
	} else {
		selected.value = undefined
	}
	show.value = true
}

function deleteFeedById(id: number) {
	deleteFeed(id)
		.then(() => {
			deleteFilter(id)
			fetchFeeds()
		})
		.catch((error) => {
			console.error('Error deleting feed:', error)
		})
}
</script>

