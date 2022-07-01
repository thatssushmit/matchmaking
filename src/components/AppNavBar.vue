<template>
  <v-app-bar clipped-left fixed app flat>
    <a
      class="d-flex align-center"
      href="https://indyfin.com/"
      @click="googleTagManagerDataLayer('click', 'link_click')"
    >
      <v-img
        alt="Indyfin Name"
        class="shrink mt-1"
        contain
        min-height="44"
        height="44"
        width="144"
        src="https://indyfin-public-resources.s3.us-east-2.amazonaws.com/images/indyfin-logo.png"
      />
    </a>
    <v-spacer></v-spacer>
    <v-btn
      v-if="currentStep === 0"
      width="117px"
      height="34px"
      class="go-back-btn"
      @click="gtmEvent"
    >
      <span>GO BACK</span>
    </v-btn>
    <v-btn
      v-else-if="!getIsAdvisorProfileOpen && currentStep != 0"
      width="117px"
      height="34px"
      class="go-back-btn"
      @click="startFromOne"
    >
      <span>START OVER</span>
    </v-btn>
    <v-btn
      width="117px"
      height="34px"
      class="go-back-btn"
      v-if="getIsAdvisorProfileOpen"
      @click="closeAdvisorProfile"
    >
      <span>GO BACK</span>
    </v-btn>
  </v-app-bar>
</template>
<script>
import { mapGetters, mapActions, mapState } from "vuex";
export default {
  name: "AppNavBar",
  components: {},
  computed: {
    ...mapGetters(["currentStep", "getIsAdvisorProfileOpen"]),
    ...mapState(["userId"]),
  },
  methods: {
    ...mapActions(["deleteData", "toggleIsAdvisorProfileOpen"]),
    gtmEvent() {
      this.googleTagManagerDataLayer("click", "link_click");
      this.open("https://indyfin.com/");
    },
    startFromOne() {
      this.googleTagManagerDataLayer("click", "start_over_click");
      if (this.$router.currentRoute.name === "Advisor Page") {
        this.deleteData().then(() => {
          this.$router.push("/");
        });
      } else{ 
        this.deleteData();
        window.dataLayer.push(function(){this.reset()})
      } 
    },
    closeAdvisorProfile() {
      this.toggleIsAdvisorProfileOpen();
      this.googleTagManagerDataLayer("click", "go_back");
    },
    open(URL) {
      window.open(URL, "_self");
    },
    googleTagManagerDataLayer(actionType, eventName) {
      this.$gtm.trackEvent({
        action: actionType,
        custom_uuid: this.userId,
        event: eventName,
        virtual_page_url: `https://${window.location.host}/virtual/${eventName}`,
        
      });
    },
  },
};
</script>
<style lang="scss">
.go-back-btn {
  height: 30px !important;
  max-width: 120px;
  font-size: 12px !important;
}
header {
  padding: 26px 60px;
  display: flex !important;
  align-items: center !important;
  .v-toolbar__content {
    flex: 1;
    height: 100px;
  }
  &.theme--light.v-app-bar.v-toolbar.v-sheet {
    background: #fff;
    box-shadow: 0 0 10px 0 #ccc !important;
  }
  .v-btn.theme--light.v-btn.v-btn--has-bg {
    background: none;
    border: 1px solid #818d98;
    color: #818d98;
    box-shadow: none !important;
    height: 34px !important;
    .v-btn__content {
      span {
        font-size: 12px;
        font-weight: 600;
        font-family: "Montserrat", sans-serif;
        color: #818d98;
      }
    }
  }
}
</style>
