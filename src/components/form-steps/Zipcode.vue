<template>
  <section class="content-500">
    <div class="error-container text-left">
      <span class="text-error">{{
        indexErrors === 1 ? "This question is required." : ""
      }}</span>
    </div>
    <form @submit.prevent="formSubmit">
      <v-row class="text-center">
        <v-col cols="12">
          <h1 class="heading text-left mb-sm-3">What is your Zip Code?</h1>
        </v-col>
        <v-col>
          <v-text-field
            v-model="formData.zipCode"
            :placeholder="textPlaceholder"
            @keypress="checkKeyPress"
            solo
            :loading="loadingStatus"
            @input="submitData"
            :error-messages="errors[indexErrors]"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <v-row justify="end">
            <v-col class="left">
              <span @click="getPrev(3, 'zipcode')" class="action" text>
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
                class="secondary action"
                type="submit"
                :disabled="buttonStatus"
                >NEXT
                <v-img
                  max-width="12"
                  class="ml-2"
                  src="@/assets/image/arrow-right.svg"
                />
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </form>
  </section>
</template>

<script>
import { mapActions} from "vuex";
import formStep from "../../mixins/formStep";
// import
export default {
  name: "Zipcode",
  mixins: [formStep],
  data: () => ({
    formData: {
      zipCode: "",
    },
    textPlaceholder: "Enter Your Zip Code",
    loadingStatus: false,
    errors: ["", "", "Enter Valid Zip Code"],
    isValid: false,
    indexErrors: 0,
    buttonStatus: false,
  }),
  methods: {
    ...mapActions(["checkZipCode"]),
    formSubmit() {
      if (!this.formData.zipCode) {
        this.indexErrors = 1;
      } else if (this.formData.zipCode.length < 5) {
        this.indexErrors = 2;
      } else if (this.formData.zipCode.length === 5) {
        if (this.isValid) {
          this.googleTagManagerDataLayer();
          this.getNext(5);
        } else {
          this.checkFromApi();
        }
      }
    },
    checkKeyPress(e) {
      if (
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        e.keyCode === 8 ||
        e.keyCode === 9
      ) {
        this.indexErrors = 0;
        this.buttonStatus = false;
        if (this.formData.zipCode.length === 5) {
          if (!(e.keyCode === 8 || e.keyCode === 9)) {
            e.preventDefault();
          }
        }
      } else e.preventDefault();
    },
    checkFromApi() {
      if (this.formData.zipCode.length === 5) {
        this.loadingStatus = true;
        this.buttonStatus = true;
        this.checkZipCode(this.formData.zipCode).then((res) => {
          if (res.status === 200) {
            this.loadingStatus = false;
            if (!res.data.valid_zip) {
              this.indexErrors = 2;
            } else {
              this.isValid = true;
              this.buttonStatus = false;
            }
          }
        });
      }
    },
    googleTagManagerDataLayer() {
      this.$gtm.trackEvent({
        action: "click",
        event: "mm_zip",
        zip_code: this.formData.zipCode,
        custom_uuid:this.userId,
        virtual_page_url: `https://${window.location.host}/virtual/zipcode`,
      });
    },
  },
  mounted() {
    this.$watch(
      function () {
        return this.formData.zipCode.length;
      },
      function () {
        if (this.formData.zipCode.length === 5) {
          this.loadingStatus = true;
          this.buttonStatus = true;
          this.checkZipCode(this.formData.zipCode).then((res) => {
            if (res.status === 200) {
              this.loadingStatus = false;
              if (!res.data.valid_zip) {
                this.indexErrors = 2;
              } else {
                this.isValid = true;
                this.buttonStatus = false;
              }
            }
          });
        }
      }
    );
  },
};
</script>
