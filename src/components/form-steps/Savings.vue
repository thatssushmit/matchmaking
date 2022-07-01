<template>
  <section class="content-660">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(currentTab)">
        <ValidationProvider v-slot="{ errors }" rules="required" name="Savings">
          <div class="error-container text-left">
            <span class="text-error">{{ errors[0] }}</span>
          </div>
          <v-row class="text-center" no-gutters>
            <v-col cols="12">
              <h1 class="heading text-left mb-3">
                What are your investable savings?
              </h1>
            </v-col>

            <v-col cols="12">
              <v-btn-toggle v-model="formData.saving">
                <v-row class="_10px">
                  <v-col
                    v-for="(obj, index) in savingOptions"
                    :key="index"
                    cols="6"
                    lg="4"
                    class="p-1"
                  >
                    <v-btn
                      class="pa-2"
                      width="100%"
                      height="50px"
                      outlined
                      tile
                      :value="obj.value"
                      @click="submitData"
                    >
                      <span>{{ obj.label }}</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-btn-toggle>
            </v-col>
            <v-col cols="12">
              <v-row justify="end">
                <v-col class="left">
                  <span @click="getPrev(4, 'savings')" class="action" text>
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
                    width="200px"
                    type="submit"
                    >{{getmatchmakingVersion === 0 ? 'NEXT' : 'SHOW MY MATCHES'}}
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
import { mapGetters } from "vuex";

export default {
  name: "Saving",
  mixins: [formStep],
  data: () => ({
    formData: {
      saving: [],
    },
    savingOptions: [
      {
        label: "Under $100K",
        value: {
          min: 0,
          max: 100000,
        },
      },
      {
        label: "$100K to $250K",
        value: {
          min: 100000,
          max: 250000,
        },
      },
      {
        label: "$250K to $500K",
        value: {
          min: 250000,
          max: 500000,
        },
      },
      {
        label: "$500K to $1M",
        value: {
          min: 500000,
          max: 1000000,
        },
      },
      {
        label: "$1M to $3M",
        value: {
          min: 1000000,
          max: 3000000,
        },
      },
      {
        label: "More than $3M",
        value: {
          min: 3000000,
          max: null,
        },
      },
    ],
  }),
  methods: {
    currentTab() {
      this.googleTagManagerDataLayer();
      this.getNext(6);
    },
    googleTagManagerDataLayer() {
      this.$gtm.trackEvent({
        action: "click",
        event: "mm_saving",
        investible_saving: this.formData.saving,
        custom_uuid:this.userId,
        virtual_page_url: `https://${window.location.host}/virtual/savings`,
      });
    },
  },
    computed: {
    ...mapGetters(["getmatchmakingVersion"]),
  },
};
</script>
