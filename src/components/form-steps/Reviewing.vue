<template>
  <section class="redirect">
    <ul>
      <li>
        <div :class="`circle-loader ${line_1}`">
          <div class="status draw"></div>
        </div>
        Reviewing your information...
      </li>
      <li :style="`visibility: ${line_1 ? 'visible' : 'hidden'}`">
        <div :class="`circle-loader ${line_2}`">
          <div class="status draw"></div>
        </div>
        Comparing to our advisors...
      </li>
      <li :style="`visibility: ${line_2 ? 'visible' : 'hidden'}`">
        <div :class="`circle-loader ${line_3}`">
          <div class="status draw"></div>
        </div>
        Retrieving your matches...
      </li>
    </ul>
  </section>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "Reviewing",
  props: ["callApi"],
  data: () => ({
    line_1: "",
    line_2: "",
    line_3: "",
    dataFetched: false,
    animationCompleted: false,
  }),
  methods: {
    ...mapActions([
      "prevStep",
      "getAdvisor",
      "postUserDetail",
      "nextStep",
      "updateAnswer",
      "changeAdvisorPage",
    ]),
    submitUserFormDetail() {
      this.postUserDetail()
        .then((res) => {
          if (res.status == 200) {
            this.changeAdvisorPage();
            this.dataFetched = true;
            const adv_details = [];
            res.data.top_advisor_matches.map((item, idx) => {
              let obj = {};
              obj = {
                card_position: idx,
                advisor_id: item.advisor_id,
              };
              adv_details.push(obj);
            });
            this.$gtm.trackEvent({
              action: "onload",
              event: "mm_funnel_success",
              custom_uuid: this.userId,
              lead_id: uuidv4().toString(),
              no_of_matches: adv_details.length,
              advisor_details: adv_details,
              virtual_page_url: `https://${window.location.host}/virtual/advisor-matches`,
            });
          }
        })
        .catch((error) => {
          this.$gtm.trackEvent({
            action: "onload",
            event: "error",
            custom_uuid: this.userId,
            error_type: "other",
            error_message: error,
            virtual_page_url: `https://${window.location.host}/virtual/advisor-matches-error`,
          });
        });
    },
  },
  computed: {
    ...mapState(["userId"]),
    ...mapGetters(["getmatchmakingVersion" ]),
  },
  mounted() {
    if (this.getmatchmakingVersion === 1) {
      this.$watch(
        function () {
          return (
            this.dataFetched.toString() + this.animationCompleted.toString()
          );
        },
        function () {
          if (this.dataFetched && this.animationCompleted) {
            this.line_3 = "success-loader";
            setTimeout(() => {
              this.changeAdvisorPage();
            }, 1000);
          }
        }
      );
    }
    let i = 1;
    const loadingInterval = setInterval(() => {
      if (i === 1) this.line_1 = "success-loader";
      if (i === 2) this.line_2 = "success-loader";
      i++;
    }, 2000);

    setTimeout(() => {
      clearInterval(loadingInterval);
      this.animationCompleted = true;
      if (this.getmatchmakingVersion === 1) {
        this.nextStep(7);
      }
    }, 6000);
  },

  async created() {
    if (this.getmatchmakingVersion === 1) {
      this.getAdvisor()
        .then((res) => {
          if (res.status == 200) {
            this.dataFetched = true;
          } else if (res.status == 404) {
            this.submitUserFormDetail();
          }
        })
        .catch((error) => {
          this.$gtm.trackEvent({
            action: "onload",
            event: "error",
            custom_uuid: this.userId,
            error_type: "other",
            error_message: error,
            virtual_page_url: `https://${window.location.host}/virtual/advisor-matches-error`,
          });
        });
    } else {
      this.submitUserFormDetail();
    }
  },
};
</script>
<style lang="scss">
.redirect {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  flex: 1;
  overflow: hidden;
  ul {
    li {
      text-align: left;
      font-size: 24px;
      line-height: 50px;
      list-style-type: none;
      font-family: "Montserrat", sans-serif;
      font-weight: 700;
      color: #092d4c;
      display: flex;
      align-items: center;
    }
  }
}

// Define vars we'll be using
$sin45: 0.70710678;

$brand-success: #85be05;
$brand-failure: #ff0000;
$loader-size: 1em;
$symbol-thickness: 3px; // Check thickness
// $check-height: $loader-size/2;
$check-left: 0.1em;
$check-height: 0.5em;
$check-width: 0.27em;
// $check-width: $check-height/2;
// $check-left: (
//   $loader-size/7 + $loader-size/12
// ); // 7/12 is a nice centrepoint of the tick
$check-color: $brand-success;
$cross-color: $brand-failure;
$cross-offset: ($check-height / $sin45) - $check-height;

.circle-loader {
  margin: 0px 10px;
  border: $symbol-thickness solid rgba(0, 0, 0, 0.2);
  border-left-color: $check-color;
  animation-name: loader-spin;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  position: relative;
  display: inline-block;
  vertical-align: top;
  &,
  &:after {
    border-radius: 50%;
    width: $loader-size;
    height: $loader-size;
  }
}

.success-loader {
  -webkit-animation: none;
  animation: none;
  border-color: $brand-success;
  transition: border opacity 500ms ease-out;
  .status {
    &.draw:after {
      animation-duration: 1.2s;
      animation-timing-function: ease;
      animation-name: checkmark;
      transform: scaleX(-1) rotate(135deg);
    }

    &:after {
      opacity: 1;
      height: $check-height;
      width: $check-width;
      transform-origin: left top;
      border-right: $symbol-thickness solid $check-color;
      border-top: $symbol-thickness solid $check-color;
      content: "";
      left: $check-left;
      top: $check-height;
      position: absolute;
    }
  }
}

.failed {
  -webkit-animation: none;
  animation: none;
  border-color: $brand-failure;
  transition: border opacity 500ms ease-out;

  .status {
    top: 50%;
    left: 50%;
    position: absolute;
    &.draw {
      &:before,
      &:after {
        animation-duration: 1.2s;
        animation-timing-function: ease;
        animation-name: crossmark;
      }

      &:before {
        transform: scaleX(-1) rotate(45deg);
      }

      &:after {
        transform: scaleX(-1) rotate(225deg);
      }
    }

    &:before,
    &:after {
      opacity: 1;
      height: $check-height / 2;
      width: $check-height / 2;
      transform-origin: left top;
      border-right: $symbol-thickness solid $cross-color;
      border-top: $symbol-thickness solid $cross-color;
      content: "";
      position: absolute;
    }

    &:before {
      left: calc(#{$cross-offset} - #{($symbol-thickness * 2)});
      top: calc(#{$symbol-thickness * 2} - #{$cross-offset});
    }

    &:after {
      left: calc(#{($symbol-thickness * 2) / $sin45} - #{$cross-offset});
      top: calc(#{$cross-offset} - #{($symbol-thickness) / $sin45});
    }
  }
}

@keyframes loader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes checkmark {
  0% {
    height: 0;
    width: 0;
    opacity: 1;
  }
  20% {
    height: 0;
    width: $check-width;
    opacity: 1;
  }
  40% {
    height: $check-height;
    width: $check-width;
    opacity: 1;
  }
  100% {
    height: $check-height;
    width: $check-width;
    opacity: 1;
  }
}

@keyframes crossmark {
  0% {
    height: 0;
    width: 0;
    opacity: 1;
  }
  20% {
    height: 0;
    width: $check-width;
    opacity: 1;
  }
  40% {
    height: $check-width;
    width: $check-width;
    opacity: 1;
  }
  100% {
    height: $check-width;
    width: $check-width;
    opacity: 1;
  }
}
</style>
