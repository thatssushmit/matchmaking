<template>
  <div>
    <section id="j-container" v-if="currentStep < 9 && !getAdvisorStatus">
      <aside class="side-view">
        <h2 v-html="title[currentStep]"></h2>
        <p v-html="text[currentStep]"></p>
        <section v-if="!title[currentStep]">
          <img
            v-if="this.screen_type === 'mobile'"
            src="@/assets/image/cards_blur_mobile@2x.png"
            width="100%"
          />
          <img
            v-if="this.screen_type === 'tab'"
            src="@/assets/image/cards_blur_tablet@2x.png"
            width="100%"
          />
          <img
            v-if="this.screen_type === 'desktop'"
            src="@/assets/image/cards_blur@2x_desktop.png"
            width="100%"
          />
        </section>
      </aside>
      <section class="content">
        <ProgressBar :percentage="progress" />
        <v-container>
          <v-fade-transition mode="out-in">
            <NeedFromAdvisor v-if="currentStep === 0" />
            <Age v-if="currentStep === 1" data-app />
            <Income v-if="currentStep === 2" />
            <Profession v-if="currentStep === 3" data-app />
            <Zipcode v-if="currentStep === 4" />
            <Savings v-if="currentStep === 5" />
            <Reviewing v-if="currentStep ===   versionState1"  callApi="false" />
            <FindMatches v-if="currentStep ===  versionState2" />
            {{ progress }}
          </v-fade-transition>
        </v-container>
        <div class="privacy">
          <v-img
            src="../assets/image/lock.svg"
            icon
            v-bind="$attrs"
            rounded
            class="privacy-icon"
          >
          </v-img>
          <article class="hover-data">
            <span
              >Indyfin secures all your information with the best industry
              standards. <br />
              Click here to view our
              <a
                href="https://www.indyfin.com/terms-of-website/"
                target="_blank"
                @click="
                  googleTagManagerDataLayer(
                    'click',
                    'link_click',
                  )
                "
                >Terms of Service</a
              >
              and
              <a
                href="https://www.indyfin.com/privacy-policy-indyfin/"
                target="_blank"
                @click="
                  googleTagManagerDataLayer(
                    'click',
                    'link_click',
                  )
                "
                >Privacy Policy</a
              >
            </span>
          </article>
        </div>
      </section>
    </section>
    <section v-else>
      <AdvisorListing />
    </section>
  </div>
</template>

<script>
import AdvisorListing from "../components/AdvisorListing.vue";
import NeedFromAdvisor from "../components/form-steps/NeedFromAdvisor.vue";
import Age from "../components/form-steps/Age.vue";
import Income from "../components/form-steps/Income.vue";
import Profession from "../components/form-steps/Profession.vue";
import Zipcode from "../components/form-steps/Zipcode.vue";
import Savings from "../components/form-steps/Savings.vue";
import FindMatches from "../components/form-steps/FindMatches.vue";
import Reviewing from "../components/form-steps/Reviewing.vue";
import { mapGetters, mapState } from "vuex";
import asideConstant from "../utils/asideConstant.json";
import ProgressBar from "../components/ProgressBar.vue";
export default {

  components: {
    NeedFromAdvisor,
    Age,
    Income,
    Profession,
    Zipcode,
    Savings,
    FindMatches,
    Reviewing,
    AdvisorListing,
    ProgressBar,
  },
  name: "MatchMaking",
  data: () => ({
    title: asideConstant.title,
    text: asideConstant.text,
    versionState1 : null,
    versionState2 : null,
    screen_type: "",
  }),
  methods: {
    setResizedAdvisor() {
      this.screen_type =
        window.innerWidth > 768
          ? "desktop"
          : window.innerWidth > 500
          ? "tab"
          : "mobile";
    },
    googleTagManagerDataLayer(actionType, eventName) {
      this.$gtm.trackEvent({
        action: actionType,
        custom_uuid: this.userId,
        event: eventName,
        virtual_page_url: `https://${window.location.host}/virtual/${eventName}`,
      });
    },
    getVersionState() {
      if(this.getmatchmakingVersion === 0){
        this.versionState1 = 7; 
        this.versionState2 = 6;
      }else{
        this.versionState1 = 6;
        this.versionState2 = 7;
      }

    }
  },
  mounted() {
    this.setResizedAdvisor();
    this.getVersionState();
  },
  computed: {
    ...mapGetters(["currentStep", "getAdvisorStatus","getmatchmakingVersion"]),
     ...mapState(['userId']),
    progress() {
      const totalSteps = 7;
      let percentage = (this.currentStep / totalSteps) * 100;
      return Math.ceil(percentage) - 2;
    },
  },
};
</script>
<style lang="scss"></style>
