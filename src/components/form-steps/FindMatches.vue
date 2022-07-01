<template>
  <section class="content-500">
    <ValidationObserver v-slot="{ handleSubmit }" ref="matchDetail">
      <form @submit.prevent="handleSubmit(isPhoneNumberValid())">
        <div class="error-container text-left">
          <span class="text-error">
            {{ indexErrors === 1 ? "This question is required." : "" }}
          </span>
        </div>
        <v-row class="text-center">
          <v-col cols="12" class="p-1 mb-3">
            <h1 class="heading text-left mb-sm-3">
              {{
                getmatchmakingVersion === 0
                  ? "We are ready to find your matches."
                  : "Unlock your Advisor match"
              }}
            </h1>
            <p class="text-left sub-heading">
              {{
                getmatchmakingVersion === 0
                  ? "Please provide these last pieces of information."
                  : " Your Contact information will be used to schedule your meeting."
              }}
            </p>
          </v-col>
          <v-col>
            <v-row class="row-col-mb-0">
              <v-col cols="12" md="6">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="fieldRequired"
                  name="First Name"
                >
                  <v-text-field
                    v-model="formData.firstName"
                    placeholder="First Name"
                    type="name"
                    :error-messages="errors[indexErrors]"
                    @blur="submitData('firstName')"
                    solo
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="6">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="fieldRequired"
                  name="Last Name"
                >
                  <v-text-field
                    v-model="formData.lastName"
                    placeholder="Last Name"
                    type="name"
                    :error-messages="errors[indexErrors]"
                    @blur="submitData('lastName')"
                    solo
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="email|fieldRequired"
                  name="Email"
                >
                  <v-text-field
                    v-model="formData.email"
                    placeholder="Email"
                    type="email"
                    :error-messages="errors[indexErrors]"
                    @blur="submitData('email')"
                    solo
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12">
                <ValidationProvider
                  v-slot="{ errors }"
                  rules="fieldRequired"
                  name="Phone Number"
                >
                  <div @keydown="checkLength">
                    <VuePhoneNumberInput
                      ref="phoneInput"
                      v-model="formData.phoneNumber"
                      :no-country-selector="true"
                      :default-country-code="countryCode"
                      :class="
                        invalidPhoneError ||
                        (invalidPhoneError === '' && errors[indexErrors])
                          ? 'error-border'
                          : ''
                      "
                      @update="getUpdate"
                    />
                    <span
                      v-if="invalidPhoneError"
                      class="text-error msg-error"
                      >{{ invalidPhoneError }}</span
                    >
                    <span
                      v-if="invalidPhoneError === ''"
                      class="text-error msg-error"
                      >{{ errors[indexErrors] }}</span
                    >
                  </div>
                </ValidationProvider>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-2">
          <v-col cols="12">
            <v-row justify="end">
              <v-col class="left">
                <span @click="getPrev(5, 'find-match')" class="action" text>
                  <v-img
                    max-width="12"
                    class="mr-2"
                    src="@/assets/image/arrow-left.svg"
                  />
                  BACK</span
                >
              </v-col>
              <v-col class="text-right">
                <v-btn
                  ref="nextButton"
                  width="200px"
                  class="secondary action"
                  type="submit"
                  color="secondary"
                  @click="pushGtm()"
                  >{{ getmatchmakingVersion === 0 ? "FIND MY MATCHES" : "VIEW MY MATCHES" }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
  </section>
</template>
<style scoped>
.msg-error {
  display: flex;
  flex: 1 0 auto;
  max-width: 100%;
  min-height: 14px;
  overflow: hidden;
  font-size: 12px;
  margin-left: 12px;
  margin-top: 5px;
  font-family: "Open Sans", sans-serif;
}
</style>
<script>
import formStep from "../../mixins/formStep";
import VuePhoneNumberInput from "vue-phone-number-input";
import store from "../../store/index";
import { mapActions, mapState, mapGetters } from "vuex";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "FindMatches",
  mixins: [formStep],
  components: {
    VuePhoneNumberInput,
  },
  data: () => ({
    formData: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: store.state.answers[7]?.phone
        ? store.state.answers[7].phone
        : "",
      phone: "",
    },
    countryCode: "US",
    invalidPhoneError: "",
    indexErrors: 0,
  }),
  methods: {
    ...mapActions([
      "prevStep",
      "getAdvisor",
      "nextStep",
      "updateAnswer",
      "changeAdvisorPage",
      "putSubmitUserForm",
    ]),
    submitData(field) {
      this.trim(field);
      this.updateAnswer(this.formData);
    },
    pushGtm(){
       if (
        this.formData.firstName &&
        this.formData.lastName &&
        this.formData.email &&
        this.formData.phoneNumber
      ) {
        this.googleTagManagerDataLayer();
      }
    },
    trim(field) {
      this.formData[field] = this.formData[field].trim();
    },
    isEmpty() {
      return Object.values(this.formData).every(
        (x) => x === null || x.trim() === ""
      );
    },
    isPhoneNumberValid() {
      if (this.isEmpty()) {
        this.indexErrors = 1;
      } else if (this.formData.phoneNumber) {
        if (this.$refs.phoneInput.isValid) {
          this.$refs.matchDetail.validate().then((res) => {
            if (res) {
              if (this.getmatchmakingVersion === 0) {
                this.nextStep(7);
              } else {
                this.putSubmitUserForm()
                  .then((res) => {
                    if (res.status == 200) {
                      var adv_details = [];
                      this.getAdvisorsProfile.map((item, idx) => {
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
                      this.changeAdvisorPage();
                    }
                  })
                  .catch((error) => {
                    this.$gtm.trackEvent({
                      action: "onload",
                      event: "error",
                      custom_uuid: this.userId,
                      error_type: "other",
                      error_message: error,
                      virtual_page_url: `https://${window.location.host}/virtual/personal-info-error`,

                    });
                  });
              }
            }
          });
        } else this.invalidPhoneError = "Enter Valid Phone Number";
      }
    },
    checkLength(e) {
      if (this.formData.phone?.length === 10) {
        if (!(e.keyCode === 8 || e.keyCode === 9)) {
          e.preventDefault();
        }
      }
    },
    getUpdate(phoneObject) {
      this.formData.countryCode = phoneObject.countryCode;
      this.formData.phone = phoneObject.nationalNumber;
      if (phoneObject.isValid) {
        this.invalidPhoneError = "";
      }
      this.updateAnswer(this.formData);
    },
    googleTagManagerDataLayer() {
      this.$gtm.trackEvent({
        action: "click",
        event: "mm_personal_info",
        first_name: this.formData.firstName,
        last_name: this.formData.lastName,
        email: this.formData.email,
        phone: this.formData.phone,
        custom_uuid: this.userId,
        virtual_page_url: `https://${window.location.host}/virtual/personal-info`,
      });
    },
  },
  mounted() {
    this.$watch(
        function () {
          const { firstName, lastName, email, phone } = this.formData;
          return firstName + lastName + email + phone;
        },
        function () {
          if (!this.isEmpty()) this.indexErrors = 0;
        }
      );
  },
  computed: {
    ...mapState(["userId"]),
    ...mapGetters(["getmatchmakingVersion", "getAdvisorsProfile"]),
  },
};
</script>
