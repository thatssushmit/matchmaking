<template>
  <section class="content-500">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(currentTab)">
        <ValidationProvider v-slot="{ errors }" rules="required" name="income">
          <div class="error-container text-left">
            <span class="text-error">{{ errors[0] }}</span>
          </div>
          <v-row class="text-center" no-gutters>
            <v-col cols="12">
              <v-btn-toggle v-model="formData.income">
                <v-row>
                  <v-col cols="12">
                    <h1 class="heading text-left">
                      What is your household income?
                    </h1>
                  </v-col>
                  <v-col
                    v-for="(value, index) in dataIncome"
                    :key="index"
                    cols="6"
                    sm="6"
                    class="p-1"
                  >
                    <v-btn
                      class="pa-2 h-60"
                      width="100%"
                      height="70px"
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
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="p-1">
              <v-row justify="end">
                <v-col class="left">
                  <span @click="getPrev(1, 'income')" class="action" text>
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
  name: "Income",
  mixins: [formStep],
  data: () => ({
    formData: {
      income: [],
    },
    dataIncome: [
      "Under $100K",
      "$100K to $150K",
      "$150K to $200K",
      "More than $200K",
    ],
  }),
  methods: {
    currentTab() {
      this.googleTagManagerDataLayer();
      this.getNext(3);
    },
    googleTagManagerDataLayer() {
      this.$gtm.trackEvent({
        action: "click",
        event: "mm_income",
        household_income: this.formData.income,
        custom_uuid: this.userId,
        virtual_page_url: `https://${window.location.host}/virtual/income`,
      });
    },
  },
  mounted() {},
};
</script>
