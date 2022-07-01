import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#01263F",
        secondary: "#1f99ff",
        accent: "#C3485F",
        warning: "#F4971E",
      },
    },
    options: {
      customProperties: true,
    },
  },
});
