<template>
	<v-form ref="showRssForm">
		<h3>
			<v-icon class="mr-2 pb-2">mdi-television-classic</v-icon>ShowRss Options
		</h3>
		<v-row class="mb-4">
			<v-col cols="4">
				<v-select
					v-model="linkType"
					:items="ShowRssLinkType"
					item-title="display"
					item-value="value"
					density="comfortable"
					color="primary"
					label="Link type"
					hide-details />
			</v-col>
			<v-col cols="6">
				<v-select
					v-model="namespaces"
					:items="ShowRssFeedNamespaces"
					item-title="display"
					item-value="value"
					density="comfortable"
					color="primary"
					label="Feed namespaces"
					hide-details />
			</v-col>
			<v-col cols="4">
				<v-select
					v-model="nameStyle"
					:items="ShowRssEpisodeNameStyle"
					item-title="display"
					item-value="value"
					color="primary"
					density="comfortable"
					label="Episode name style"
					hide-details />
			</v-col>
			<v-col cols="6">
				<v-select
					v-model="quality"
					:items="ShowRssQuality"
					item-title="display"
					item-value="value"
					color="primary"
					density="comfortable"
					label="Quality"
					hide-details />
			</v-col>
			<v-col cols="6">
				<v-select
					v-model="properRepack"
					:items="ShowRssProperRepack"
					item-title="display"
					item-value="value"
					label="PROPER/REPACK"
					density="comfortable"
					color="primary"
					hide-details />
			</v-col>
		</v-row>
	</v-form>
</template>
<script lang="ts" setup>
import {
	ShowRssEpisodeNameStyle,
	ShowRssFeedNamespaces,
	ShowRssLinkType,
	ShowRssProperRepack,
	ShowRssQuality,
} from '../../const/ShowRss'
import { ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'

const props = defineProps<{
	url?: string
}>()

const linkType = ref(true)
const namespaces = ref(true)
const nameStyle = ref<'clean' | null>(null)
const quality = ref<string | null>(null)
const properRepack = ref<'yes' | 'no' | null>(null)

const showRssForm = ref<VForm>()

const emit = defineEmits<(feed: 'update', value: string) => void>()

watch([linkType, namespaces, nameStyle, quality, properRepack], updateUrl)

function updateUrl() {
	const base = props.url?.split('?')[0] ?? ''
	const params = new URLSearchParams()
	params.set('magnets', String(linkType.value))
	params.set('namespaces', String(namespaces.value))
	params.set('name', nameStyle.value ?? 'null')
	params.set('quality', quality.value ?? 'null')
	params.set('re', properRepack.value ?? 'null')
	emit('update', base + '?' + params.toString())
}

watch(
	() => props.url,
	(newValue) => {
		if (newValue) {
			const params = new URL(newValue).searchParams
			linkType.value = params.get('magnets') === 'true'
			namespaces.value = params.get('namespaces') === 'true'
			nameStyle.value = (
				params.get('name') === 'null' ? null : params.get('name')
			) as 'clean' | null
			quality.value =
				params.get('quality') === 'null' ? null : params.get('quality')
			properRepack.value = (
				params.get('re') === 'null' ? null : params.get('re')
			) as 'yes' | 'no' | null
		} else {
			showRssForm.value?.reset()
		}
	},
	{ immediate: true }
)
</script>
