<template>
	<v-app-bar app color="primary" dark>
		<v-toolbar-title class="font-weight-bold">
			<v-icon> mdi-rss-box </v-icon> RSS Parser
		</v-toolbar-title>
		<v-spacer></v-spacer>
		<v-chip class="mr-4">
			<v-tooltip v-if="update">
				<template #activator="{ props }">
					<v-icon v-bind="props" color="red">mdi-alert</v-icon>
				</template>
				<span>New version available: {{ newVersion }}</span>
			</v-tooltip>
			{{ version }}
		</v-chip>
	</v-app-bar>
</template>
<script setup lang="ts">
import { getVersion } from '@/repositories/version.repository'
import { isNewer } from '@/utils/version'
import { onMounted, ref } from 'vue'

const version = import.meta.env.VITE_VERSION
const newVersion = ref('')
const update = ref(false)

onMounted(async () => {
	getVersion().then((v) => {
		if (isNewer(v, version)) {
			update.value = true
			newVersion.value = v
		}
	})
})
</script>
