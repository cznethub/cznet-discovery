import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        primary: colors.blue.darken2,
        secondary: colors.blueGrey,
        accent: colors.blue,
        error: colors.red.accent3,
        success: colors.teal.accent4,
        info: colors.blueGrey,
        navbar: colors.blueGrey,
      },
    },
    variations: {
      colors: ["primary", "secondary", "navbar"],
      lighten: 4,
      darken: 4,
    },
  },
});
