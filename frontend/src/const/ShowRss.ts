import type { SelectOption } from '@/models/select.model'

export const ShowRssQuality: SelectOption<string>[] = [
	{ display: 'Per-show settings (recommended)', value: null },
	{ display: 'Force all (override per-show setting)', value: 'any' },
	{
		display: 'Force standard quality (override per-show setting)',
		value: 'sd',
	},
	{
		display: 'Force 720p (HD) quality (override per-show setting)',
		value: 'hd',
	},
	{
		display: 'Force 1080p (Full HD) quality (override per-show setting)',
		value: 'fhd',
	},
	{
		display: 'Force any HD quality (override per-show setting)',
		value: 'anyhd',
	},
]

export const ShowRssLinkType: SelectOption<boolean>[] = [
	{ display: 'Use magnets in feed (recommended)', value: true },
	{ display: 'Use mirror URLs (legacy support)', value: false },
]

export const ShowRssFeedNamespaces: SelectOption<boolean>[] = [
	{ display: 'Include namespaces (required for Catch)', value: true },
	{ display: "Don't include namespaces (generic option)", value: false },
]

export const ShowRssEpisodeNameStyle: SelectOption<string>[] = [
	{ display: 'Raw episode name (torrent client)', value: null },
	{ display: 'Clean episode name (feed reader)', value: 'clean' },
]

export const ShowRssProperRepack: SelectOption<string>[] = [
	{ display: 'Per-show settings', value: null },
	{
		display: 'Include PROPER/REPACK (override per-show setting)',
		value: 'yes',
	},
	{ display: 'Skip PROPER/REPACK (override per-show settings)', value: 'no' },
]
