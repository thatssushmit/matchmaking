<template>
  <section class="content-500">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(currentTab)">
        <ValidationProvider v-slot="{ errors }" rules="required" name="age">
          <div class="error-container text-left">
            <span class="text-error">{{ errors[0] }}</span>
          </div>
          <v-row class="text-center">
            <v-col cols="12">
              <h1 class="heading text-left mb-sm-3">How old are you?</h1>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="formData.age"
                :items="items"
                :placeholder="textPlaceholder"
                solo
                clearable
                @input="submitData"
                height="40px"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <v-row justify="end">
                <v-col class="left">
                  <span @click="getPrev(0, 'age')" class="action" text>
                    <v-img
                      max-width="12"
                      class="mr-2"
                      src="@/assets/image/arrow-left.svg"
                    />
                    BACK</span
                  >
                </v-col>
                <v-col class="text-right">
                  <v-btn class="secondary action" type="submit"
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
        </ValidationProvider>
      </form>
    </ValidationObserver>
  </section>
</template>

<script>
import formStep from "../../mixins/formStep";

export default {
  name: "Age",
  mixins: [formStep],
  data: () => ({
    formData: {
      age: [],
    },
    items: ["20 to 29", "30 to 39", "40 to 49", "50 to 59", "60 and more"],
    textPlaceholder: "Select from the list",
  }),

  methods: {
    currentTab() {
      this.googleTagManagerDataLayer();
      this.getNext(2);
    },
    googleTagManagerDataLayer() {
      this.$gtm.trackEvent({
        action: "click",
        event: "mm_age",
        age_range: this.formData.age,
        custom_uuid: this.userId,
        virtual_page_url: `https://${window.location.host}/virtual/age`,
      });
    },
  },
  mounted() {},
};
</script>
