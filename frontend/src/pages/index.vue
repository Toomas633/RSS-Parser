<template>
	<div class="d-flex">
		<FeedList
			:feeds="feeds"
			:loading="feedsLoading"
			@edit="edit($event)"
			@add="show = true" />
		<ManageFeed v-if="show" :feed="selected" @close="closeAddTab()" />
		<v-container v-else />
	</div>
</template>
<script lang="ts" setup>
import type { Feed } from '@/models/feed.model'
import { getFeeds } from '@/repositories/feed.repository'
import { onMounted, onUnmounted, ref } from 'vue'

const feeds = ref<Feed[]>([])
const selected = ref<Feed | undefined>(undefined)
const show = ref(false)
const feedsLoading = ref(false)

const updateInterval = 5000 // 5 seconds

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

function closeAddTab() {
	fetchFeeds()
	selected.value = undefined
	show.value = false
}

function edit(feed: Feed) {
	show.value = true
	selected.value = feed
}
</script>

