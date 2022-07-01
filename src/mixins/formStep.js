import { mapActions, mapGetters, mapState } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { extend } from "vee-validate";
import { required, email, alpha } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: "This question is required.",
});

extend("fieldRequired", {
  ...required,
  message: "{_field_} is required.",
});

extend("email", email);
extend("alpha", alpha);

extend("numberOnly", {
  validate(v) {
    return /^[0-9]*$/.test(v);
  },

  message: "Numbers only please",
});

const formStep = {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  computed:{
    ...mapState(["userId"]),
  },
  methods: {
    ...mapGetters(["getAnswers"]),
    ...mapActions(["nextStep", "prevStep", "updateAnswer"]),
    getNext(value) {
      this.nextStep(value);
    },
    getPrev(value, step_name) {
      this.$gtm.trackEvent({
        action: "click",
        event: "back_click",
        custom_uuid:this.userId,
        virtual_page_url: `https://${window.location.host}/virtual/${step_name}`
      })
      this.prevStep(value);
    },
    submitData() {
      this.updateAnswer(this.formData);
    },
  },
  mounted() {
    if (this.getAnswers()) {
      this.formData = this.getAnswers();
    }
  },
};

export default formStep;
