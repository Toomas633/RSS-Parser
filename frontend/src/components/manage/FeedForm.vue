<template>
	<v-form ref="feedForm" v-model="valid" lazy-validation>
		<v-row>
			<v-col cols="4">
				<v-text-field
					v-model="name"
					:rules="[rules.required]"
					class="required"
					density="comfortable"
					color="primary"
					label="Name"
					required />
			</v-col>
			<v-col cols="8">
				<v-text-field
					v-model="url"
					:rules="[rules.required, rules.url]"
					class="required"
					density="comfortable"
					color="primary"
					label="URL"
					required />
			</v-col>
			<v-col cols="4" class="pt-0 pl-1">
				<v-checkbox
					v-model="tv"
					class="mt-n1 ml-1"
					color="primary"
					hide-details
					density="compact"
					label="Filter as TV show" />
				<v-checkbox
					v-model="addFilters"
					class="ml-1"
					color="primary"
					hide-details
					density="compact"
					label="Add filters" />
			</v-col>
			<v-col class="pt-0">
				<v-select
					v-model="queryType"
					:items="Object.values(QueryType)"
					label="Quary builder type "
					density="comfortable"
					color="primary"
					hide-details />
			</v-col>
		</v-row>
	</v-form>
</template>
<script lang="ts" setup>
import { QueryType } from '@/enums/queryType'
import type { Feed } from '@/models/feed.model'
import { ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'

const props = defineProps<{
	feed?: Feed
	filters?: boolean
}>()

const valid = ref(false)
const name = ref('')
const url = ref('')
const tv = ref(false)
const addFilters = ref(false)
const queryType = ref<QueryType>(QueryType.None)
const feedForm = ref<VForm>()

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

const emit = defineEmits<{
	(valid: 'valid', value: boolean): void
	(feed: 'feed', value: Feed): void
	(addFilters: 'addFilters', value: boolean): void
	(queryType: 'queryType', value: QueryType): void
}>()

watch(valid, (newValue) => emit('valid', newValue))

watch([name, url, tv], (newValue) => {
	const feed: Feed = {
		id: props.feed?.id ?? 0,
		name: newValue[0],
		url: newValue[1],
		tv: newValue[2],
	}
	emit('feed', feed)
})

watch(addFilters, (newValue) => emit('addFilters', newValue))

watch(queryType, (newValue) => emit('queryType', newValue))

watch(
	() => props.feed,
	(newValue) => {
		if (newValue) {
			name.value = newValue.name
			url.value = newValue.url
			tv.value = !!newValue.tv
		} else {
			feedForm.value?.reset()
		}
	},
	{ immediate: true }
)

watch(
	() => props.filters,
	(newValue) => {
		addFilters.value = !!newValue
	},
	{ immediate: true }
)
</script>
<style scoped>
.v-input--density-compact {
	--v-input-control-height: 28px;
}
</style>
