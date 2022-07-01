<template>
  <v-app>
    <div id="app">
      <AppNavBar />
      <v-main>
        <v-fade-transition mode="out-in">
          <router-view></router-view>
        </v-fade-transition>
      </v-main>
      <!-- <AppDrawer v-if="!isAdvisorPage" /> -->
    </div>
  </v-app>
</template>

<script>
import AppNavBar from "./components/AppNavBar.vue";
// import AppDrawer from "./components/AppDrawer.vue";
import "@/assets/scss/style.scss";
import { mapMutations } from "vuex";

export default {
  components: {
    AppNavBar,
    // AppDrawer,
  },
  methods: {
    ...mapMutations(["MATCHMAKING_VERSION"]),
  },
  computed: {
    isAdvisorPage() {
      if (this.$route.name === "Advisor Page") {
        return true;
      }
      return false;
    },
  },
  async created() {
    if (window.location.search.indexOf(process.env.VUE_APP_QUERY_PARAM) > -1) {
      this.MATCHMAKING_VERSION(1);
    }
    else {
      this.MATCHMAKING_VERSION(0);
    }
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
