<template>
	<v-container fluid>
		<span class="d-flex justify-space-between align-center">
			<h2 class="ml-n2 mb-2"><v-icon>mdi-plus</v-icon>Add Feed</h2>
			<v-btn variant="plain" icon="mdi-close" @click="emit('close')" />
		</span>
		<v-form ref="form" v-model="valid">
			<v-row>
				<v-col cols="4">
					<v-text-field
						v-model="name"
						:rules="[rules.required]"
						density="comfortable"
						color="primary"
						label="Name"
						hint="Feed name"
						required />
				</v-col>
				<v-col>
					<v-text-field
						v-model="url"
						:rules="[rules.required, rules.url]"
						density="comfortable"
						color="primary"
						label="URL"
						hint="Feed URL"
						required />
				</v-col>
			</v-row>
			<v-row class="mt-0">
				<v-col cols="4" class="pt-0 pl-1">
					<v-checkbox
						v-model="tv"
						class="mt-n3"
						color="primary"
						hide-details
						density="comfortable"
						label="Filter as TV show" />
					<v-checkbox
						v-model="addFilters"
						class="mt-n5"
						color="primary"
						hide-details
						density="comfortable"
						label="Add filters" />
				</v-col>
				<v-col class="pt-0">
					<v-select
						v-if="addFilters"
						v-model="filtersType"
						:items="Object.values(FiltersType)"
						label="Filters Type"
						density="comfortable"
						color="primary"
						hide-details />
				</v-col>
			</v-row>
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
		</v-form>
		<RssView v-if="testResponse" :rss="testResponse" />
	</v-container>
</template>

<script lang="ts" setup>
import { FiltersType } from '@/enums/filtersType'
import type { Feed } from '@/models/feed.model'
import { testFetch } from '@/repositories/fetch.repository'
import { ref } from 'vue'

const valid = ref(false)
const name = ref('')
const url = ref('')
const tv = ref(false)
const addFilters = ref(false)
const filtersType = ref<FiltersType>(FiltersType.None)
const loading = ref(false)
const testLoading = ref(false)
const testResponse = ref('')

const emit = defineEmits<(close: 'close') => void>()

const rules = {
	required: (value: string) => !!value || 'Required.',
	url: (value: string) => {
		const pattern = new RegExp(
			'^(https?:\\/\\/)?' +
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
				'((\\d{1,3}\\.){3}\\d{1,3}))' +
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
				'(\\?[;&a-z\\d%_.~+=-]*)?' +
				'(\\#[-a-z\\d_]*)?$',
			'i'
		)
		return pattern.test(value) || 'Invalid URL.'
	},
}

async function test() {
	const feed = {
		name: name.value,
		url: url.value,
		tv: tv.value,
	}
	if (valid.value) {
		testLoading.value = true
		testResponse.value = await testFetch(feed.url)
			.then((response) => {
				return response as string
			})
			.catch((error) => {
				console.error('Error fetching feed:', error)
				return 'Error fetching feed.'
			})
			.finally(() => (testLoading.value = false))
	}
}

function submit() {
	const feed: Partial<Feed> = {
		name: name.value,
		url: url.value,
		tv: tv.value,
	}
	loading.value = true
	if (valid.value) {
		console.log('Form submitted:', feed)
		// TODO emit('close')
	}
	loading.value = false
}
</script>
