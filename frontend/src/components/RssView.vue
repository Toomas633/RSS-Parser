<template>
	<v-textarea
		class="mt-4"
		:model-value="formattedRss"
		label="RSS Feed"
		prepend-inner-icon="mdi-rss"
		color="primary"
		rows="20"
		outlined
		hide-details
		no-resize
		density="comfortable"
		readonly />
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import xmlFormatter from 'xml-formatter'

const props = defineProps<{
	rss: string
}>()

const formattedRss = computed(() => {
	try {
		return xmlFormatter(props.rss)
	} catch (error) {
		console.error('Error formatting RSS:', error)
		return 'Invalid RSS format'
	}
})
</script>
