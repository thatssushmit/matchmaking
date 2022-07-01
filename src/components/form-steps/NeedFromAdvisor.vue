<template>
  <section class="content-660">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(currentTab)">
        <ValidationProvider
          v-slot="{ errors }"
          :rules="{ required: !formData.additionalDetail }"
          name="advisor"
        >
          <div class="error-container text-center text-sm-left">
            <span class="text-error">{{ errors[0] }}</span>
          </div>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="12 ">
                  <h1 class="heading text-md-left mb-3">
                    What help do you need from an advisor?
                  </h1>
                </v-col>
              </v-row>

              <v-btn-toggle multiple v-model="formData.selected">
                <v-row class="_10px p-xs-1" justify="center">
                  <v-col
                    v-for="(value, index) in dataText"
                    :key="index"
                    cols="6"
                    sm="6"
                    md="4"
                    class="p-1"
                  >
                    <v-btn
                      width="100%"
                      height="50px"
                      outlined
                      tile
                      :value="value"
                      @click="submitData"
                    >
                      <span>{{ value }}</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-btn-toggle>
              <v-row class="p-xs-1 _10-sm-px">
                <v-col class="p-1">
                  <v-textarea
                    name="textarea"
                    v-model="formData.additionalDetail"
                    auto-grow
                    outlined
                    :height="getScreenType === 'mobile' ? '57px' : '100px'"
                    :class="errors[0] ? 'error--text' : ''"
                    @mouseout="submitData"
                    :placeholder="textPlaceholder"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row justify="end" no-gutters>
            <v-col class="text-right">
              <v-btn class="secondary action" type="submit" ref="nextButton"
                >NEXT
                <v-img
                  max-width="12"
                  class="ml-2"
                  src="@/assets/image/arrow-right.svg"
                />
              </v-btn>
            </v-col>
          </v-row>
        </ValidationProvider>
      </form>
    </ValidationObserver>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import formStep from "../../mixins/formStep";
export default {
  name: "NeedFromAdvisor",
  mixins: [formStep],
  data: () => ({
    formData: {
      selected: [],
      additionalDetail: "",
    },
    query_dict: {},
    dataText: [
      "Retirement",
      "Investment",
      "Taxes",
      "College Education",
      "Manage Inheritance",
      "Second Opinion",
      "Business Ownership",
      "Estate Planning",
      "Income Stream",
    ],
    textPlaceholder:
      "Additional details about the topics you've selected or other topics that are important to you.",
  }),
  computed: {
    ...mapGetters(["getScreenType"]),
  },
  methods: {
    currentTab() {
      this.googleTagManagerDataLayer();
      this.getNext(1);
    },
    submitData() {
      this.updateAnswer(this.formData);
    },
    googleTagManagerDataLayer() {
      this.$gtm.trackEvent({
        action: "click",
        event: "mm_topics",
        financial_topics: this.formData,
        custom_uuid: this.userId,
        virtual_page_url: `https://${window.location.host}/virtual/topics`,
      });
    },
  },
  beforeMount() {
    if (window.location.href.toString().includes("?")) {
      this.isQueryParam = window.location.href.toString().split("?")[1];
      this.isQueryParam.split("&").map((data) => {
        this.query_dict[data.split("=")[0]] = data.split("=")[1];
      });
    }
    this.query_dict["landing_page"] = "homepage";
    this.$gtm.trackEvent({
      action: "start",
      event: "mm_funnel_start",
      queryParam: this.query_dict,
      custom_uuid: this.userId,
      virtual_page_url: `https://${window.location.host}/virtual/start`,
    });
  },
};
</script>
<style lang="scss" scoped>
$primary-color: #1c89e6;
$secondary-color: #092d4c;
@media (max-width: 500px) {
  .v-btn.action {
    width: 100% !important;
  }
}
</style>
