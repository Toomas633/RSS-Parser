import { QueryType } from '../enums/queryType'
import type { SelectOption } from '../models/select.model'

export const QueryTypesHint =
	'Helping forms for constructing the URL for selected parser type (changes are persisted in the URL field). NB! Changing will break the URL if wrong parser selected.'

export const QueryTypeOptions: SelectOption<QueryType>[] = [
	{ display: 'None', value: QueryType.None },
	{ display: 'Jackett', value: QueryType.Jackett, props: { disabled: false } },
	{ display: 'ShowRSS', value: QueryType.ShowRss, props: { disabled: false } },
]
