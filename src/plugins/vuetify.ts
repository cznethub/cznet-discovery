import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: colors.teal.darken2,
        secondary: '#184848',
        accent: colors.blue,
        error: colors.red.accent3,
        success: colors.teal.accent4,
        warning: colors.teal.accent4,
        info: colors.blueGrey,
        navbar: '#FFF'
      },
      // dark: {
      //   primary: colors.blueGrey,
      //   secondary: colors.teal.darken1,
      //   accent: colors.amber,
      //   error: colors.red.accent3,
      //   success: colors.teal.accent4,
      //   info: colors.blueGrey,
      // },
    },
  },
});
