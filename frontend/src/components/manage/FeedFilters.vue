<template>
	<v-form ref="filterForm" v-model="valid" lazy-validation>
		<h3><v-icon class="mr-2">mdi-filter</v-icon>Filters</h3>
		<v-row>
			<v-col cols="4">
				<v-text-field
					v-model="showName"
					density="comfortable"
					color="primary"
					hide-details
					label="Show Name">
				</v-text-field>
			</v-col>
			<v-col cols="2">
				<v-text-field
					v-model="seasonStart"
					density="comfortable"
					color="primary"
					label="Season Start"
					hide-details
					type="number">
				</v-text-field>
			</v-col>
			<v-col cols="2">
				<v-text-field
					v-model="episodeStart"
					density="comfortable"
					color="primary"
					label="Episode Start"
					hide-details
					type="number">
				</v-text-field>
			</v-col>
			<v-col cols="4">
				<v-text-field
					v-model="exclude"
					density="comfortable"
					color="primary"
					label="Exclude"
					hint="Comma separated list of words to exclude"
					persistent-hint
					clearable
					placeholder="Press Enter to add" />
			</v-col>
		</v-row>
	</v-form>
</template>
<script lang="ts" setup>
import type { Filter } from '../../models/filter.model'
import { formatFilter } from '../../utils/filter.utils'
import { ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'

const props = defineProps<{
	filter?: Filter
}>()

const valid = ref(false)
const exclude = ref<string>('')
const seasonStart = ref(0)
const episodeStart = ref(0)
const showName = ref('')
const filterForm = ref<VForm>()

const emit = defineEmits<(filters: 'filter', value: Filter) => void>()

watch(
	() => props.filter,
	(newValue) => {
		if (newValue) {
			exclude.value = newValue.exclude?.join(', ') ?? ''
			seasonStart.value = newValue.seasonStart ?? 0
			episodeStart.value = newValue.episodeStart ?? 0
			showName.value = newValue.showName ?? ''
		} else {
			filterForm.value?.reset()
		}
	},
	{ immediate: true }
)

watch([showName, seasonStart, episodeStart, exclude], (newVal) => {
	const filter: Filter = {
		showName: newVal[0],
		seasonStart: newVal[1],
		episodeStart: newVal[2],
		exclude: formatExclude(newVal[3]),
	}

	emit('filter', formatFilter(filter))
})

function formatExclude(input: string) {
	return input
		.split(',')
		.map((item) => item.trim())
		.filter((item) => item !== '')
}
</script>
