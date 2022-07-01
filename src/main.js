import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router/index";
import store from "./store/index";
import { Amplify } from "aws-amplify";

import "vue-phone-number-input/dist/vue-phone-number-input.css";
// import "./assets/scss/style.scss";
Amplify.configure({
  Auth: {
    identityPoolId: process.env.VUE_APP_COGNITO_IDENTITY_POOL_ID,
    region: process.env.VUE_APP_AWS_REGION,
    userPoolId: process.env.VUE_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.VUE_APP_COGNITO_USER_POOL_CLIENT_ID,
  },
  API: {
    
    endpoints: [
      {
        name: "MatchMaking",
        endpoint: process.env.VUE_APP_SERVICE_URL,
        region: process.env.VUE_APP_AWS_REGION,
      },
    ],
  },
});

Vue.config.productionTip = false;

new Vue({
  vuetify,
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
