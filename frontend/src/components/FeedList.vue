<template>
	<v-container fluid width="250">
		<span class="d-flex justify-space-between align-center mb-2">
			<v-btn color="green" prepend-icon="mdi-plus" @click="emitAddNew()">
				Add
			</v-btn>
			<v-icon v-if="loading" class="loading">mdi-loading</v-icon>
		</span>
		<v-divider class="my-2" />
		<div v-for="(feed, index) in feeds" :key="feed.id">
			<v-card class="mb-4 pb-2 pr-2">
				<div class="d-flex justify-space-between align-center">
					<v-card-title class="ellipsis py-1">
						{{ feed.name }}
					</v-card-title>
					<span>
						<v-icon
							class="edit"
							:disabled="active === index || loading"
							@click="emitSelected(feed, index)">
							mdi-pencil
						</v-icon>
						<v-icon
							class="delete"
							:disabled="loading"
							@click="deleteFeed(feed.id)">
							mdi-delete
						</v-icon>
					</span>
				</div>
				<v-card-subtitle>{{ feed.url }}</v-card-subtitle>
			</v-card>
		</div>
		<h3 v-if="!feeds.length" class="text-center">No feeds available</h3>
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
	(event: 'edit', feed: Feed): void
	(event: 'add'): void
	(event: 'delete', id: number): void
}>()

function emitSelected(feed: Feed, index: number) {
	active.value = index
	emit('edit', feed)
}

function emitAddNew() {
	active.value = undefined
	emit('add')
}

function deleteFeed(id: number) {
	active.value = undefined
	emit('delete', id)
}
</script>
<style scoped>
.v-card-title {
	width: 10rem;
}
</style>
