<template>
	<v-container fluid>
		<span class="d-flex justify-space-between align-center mb-2">
			<v-btn color="green" prepend-icon="mdi-plus" @click="emitAddNew()">
				Add
			</v-btn>
			<v-icon v-if="loading" class="loading">mdi-loading</v-icon>
		</span>
		<v-divider class="my-2" />
		<v-row v-if="feeds.length">
			<v-col v-for="(feed, index) in feeds" :key="feed.id" cols="12" md="4">
				<v-card class="mb-4" @click="emitSelected(feed, index)">
					<v-card-title>{{ feed.name }}</v-card-title>
					<v-card-subtitle>{{ feed.url }}</v-card-subtitle>
					<v-icon>mdi-edit</v-icon>
				</v-card>
			</v-col>
		</v-row>
		<h3 v-else class="text-center">No feeds available</h3>
	</v-container>
</template>
<script lang="ts" setup>
import type { Feed } from '@/models/feed.model'
import { ref } from 'vue'

const active = ref<number | undefined>()

defineProps<{
	feeds: Feed[]
	loading: boolean
}>()

const emit = defineEmits<{
	(select: 'select', feed: Feed): void
	(add: 'add'): void
}>()

function emitSelected(feed: Feed, index: number) {
	active.value = index
	emit('select', feed)
}

function emitAddNew() {
	active.value = undefined
	emit('add')
}
</script>
