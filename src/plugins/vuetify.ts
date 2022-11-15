import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.blue.darken2,
        secondary: colors.teal.darken1,
        accent: colors.indigo.lighten1,
        error: colors.red.accent3,
        success: colors.teal.accent4,
        info: colors.blueGrey,
      },
      dark: {
        primary: colors.blueGrey,
        secondary: colors.teal.darken1,
        accent: colors.amber,
        error: colors.red.accent3,
        success: colors.teal.accent4,
        info: colors.blueGrey,
      },
    },
  },
});
