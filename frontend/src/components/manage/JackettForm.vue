<template>
	<v-form ref="jackettForm">
		<h3>
			<v-icon class="mr-2 pb-2">mdi-account-tie-woman</v-icon>Jackett Options
		</h3>
		<v-row class="mb-4">
			<v-col cols="4">
				<v-text-field
					v-model="key"
					density="comfortable"
					color="primary"
					label="API key"
					hide-details />
			</v-col>
			<v-col>
				<v-text-field
					v-model="query"
					density="comfortable"
					color="primary"
					label="Search query"
					hide-details />
			</v-col>
		</v-row>
	</v-form>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'

const props = defineProps<{
	url?: string
}>()

const key = ref<string | null>(null)
const query = ref<string | null>(null)

const jackettForm = ref<VForm>()

const emit = defineEmits<(feed: 'update', value: string) => void>()

watch([key, query], updateUrl)

function updateUrl() {
	const base = props.url?.split('?')[0] ?? ''
	const params = new URLSearchParams()
	params.set('apikey', String(key.value))
	params.set('q', String(query.value))
	emit('update', base + '?' + params.toString())
}

watch(
	() => props.url,
	(newValue) => {
		if (newValue) {
			const params = new URL(newValue).searchParams
			key.value = params.get('apikey')
			query.value = params.get('q')
		} else {
			jackettForm.value?.reset()
		}
	},
	{ immediate: true }
)
</script>
