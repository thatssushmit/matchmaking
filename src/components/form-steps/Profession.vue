<template>
  <section class="content-500">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(currentTab)">
        <ValidationProvider
          v-slot="{ errors }"
          rules="required"
          name="profession"
        >
          <div class="error-container text-left">
            <span class="text-error">{{ errors[0] }}</span>
          </div>
          <v-row class="text-center">
            <v-col cols="12">
              <h1 class="heading text-left mb-sm-3">
                What is your profession?
              </h1>
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="formData.profession"
                :items="items"
                :placeholder="textPlaceholder"
                solo
                clearable
                @input="submitData"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <v-row justify="end">
                <v-col class="left">
                  <span @click="getPrev(2, 'profession')" class="action" text>
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
  name: "Profession",
  mixins: [formStep],
  data: () => ({
    formData: {
      profession: [],
    },
    items: [
      "Accountant",
      "Actor",
      "Adjuster",
      "Advertiser",
      "Ambassador",
      "Analyst",
      "Appraiser",
      "Architect",
      "Artist",
      "Athlete",
      "Attorney",
      "Auctioneer",
      "Auditor",
      "Banking",
      "Bookkeeper",
      "Broker",
      "Business Executive",
      "Business Owner",
      "Caregiver",
      "Chef",
      "Chiropractor",
      "Civil Servant",
      "Compliance",
      "Construction",
      "Consultant",
      "Contractor",
      "Counselor",
      "Craftsman",
      "Customer Service Representative",
      "Dancer",
      "Dentist",
      "Designer",
      "Doctor",
      "Editor",
      "Engineer",
      "Executive Assistant",
      "Farmer",
      "Financial Advisor",
      "Financial Planner",
      "Firefighter",
      "Flight Attendant",
      "Human Resources",
      "Inspector",
      "Instructor",
      "Investigator",
      "Investor",
      "IT Professional",
      "Journalist",
      "Judge",
      "Law Enforcement",
      "Legal Professional",
      "Lending Professional",
      "Marketer",
      "Military",
      "Mortician",
      "Nurse",
      "Office Associate",
      "Oil & Gas",
      "Other",
      "Performer",
      "Pharmacist",
      "Physical Therapist",
      "Physician",
      "Pilot",
      "Police Officer",
      "Politician",
      "Professor",
      "Project Manager",
      "Public Relations",
      "Rancher",
      "Real Estate Professional",
      "Registered Rep",
      "Regulatory Professional",
      "Researcher",
      "Salesperson",
      "Scientist",
      "Surgeon",
      "Teacher",
      "Teller",
      "Therapist",
      "Underwriter",
      "Veterinarian",
      "Writer",
    ],
    textPlaceholder: "Select from the list",
  }),
  methods: {
    currentTab() {
      this.googleTagManagerDataLayer();
      this.getNext(4);
    },
    googleTagManagerDataLayer() {
      this.$gtm.trackEvent({
        action: "click",
        event: "mm_profession",
        profession: this.formData.profession,
        custom_uuid: this.userId,
        virtual_page_url: `https://${window.location.host}/virtual/profession`,
      });
    },
  },
};
</script>
