import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import colors from 'vuetify/util/colors'

import { createVuetify } from 'vuetify'

export default createVuetify({
	theme: {
		defaultTheme: 'dark',
		themes: {
			light: {
				colors: {
					primary: colors.amber.darken2,
				},
			},
			dark: {
				colors: {
					primary: colors.amber.darken2,
				},
			},
		},
	},
})

