import { API } from "aws-amplify";
const actions = {
  // steps
  nextStep({ commit }, number) {
    commit("NEXT_STEP", number);
  },

  prevStep({ commit }, number) {
    commit("PREVIOUS_STEP", number);
  },
  // Answers
  updateAnswer({ commit }, value) {
    commit("UPDATE_OR_ADD_ANSWER", value);
  },
  deleteData({ commit }) {
    commit("DELETE_DATA");
  },
  toggleIsAdvisorProfileOpen({ commit }) {
    commit("IS_ADVISOR_PROFILE_OPEN");
  },
  changeAdvisorPage({ commit }) {
    commit("ADVISOR_PAGE_STATUS");
  },
  async getAdvisor({ getters, commit }) {
    let query_str = window.location.search;

    // let query_param = this.$router.currentRoute.query;

    const data = getters.apiPayload;
    const {zipCode, profession, saving, additionalDetail, selected, age, income,  } =
      data;
    let endpoint;
    if (query_str) {
      endpoint = `/advisor_matchmaking${query_str}`;
    } else {
      endpoint = `/advisor_matchmaking`;
    }
    return new Promise((resolve, reject) => {
      // Do something here... lets say, a http call using vue-resource
      API.post("MatchMaking", endpoint, {
        body: {
          zip_code: zipCode,
          investable_assets: saving,
          occupation: profession,
          need_for_advisor: selected,
          additional_detail: additionalDetail,
          age: age,
          income: income,

        },
        response: true,
      }).then(
        (response) => {
          commit("VISITOR_JOB_ID", response.data.job_id);
          commit("ADVISORS_PROFILE", response.data.top_advisor_matches);
          // http success, call the mutator and change something in state
          resolve(response); // Let the calling function know that http is done. You may send some data back
        },
        (error) => {
          // http failed, let the calling function know that action did not work out
          reject(error);
        }
      );
    });
  },
  async putSubmitUserForm({ getters}) {


    // let query_param = this.$router.currentRoute.query;

    const data = getters.apiPayload;
    const { firstName, lastName, phone ,email } =
      data;
    let job_id = getters.getVisitorJobId;

   const endpoint = `/advisor_matchmaking/jobs/${job_id}`;

    return new Promise((resolve, reject) => {
      // Do something here... lets say, a http call using vue-resource
      API.put("MatchMaking", endpoint, {
        body: {
          email:email,
          firstname: firstName,
          lastname: lastName,
          phone: Number(phone),

        },
        response: true,
      }).then(
        (response) => {

          // http success, call the mutator and change something in state
          resolve(response); // Let the calling function know that http is done. You may send some data back
        },
        (error) => {
          // http failed, let the calling function know that action did not work out
          reject(error);
        }
      );
    });    
  },
  async postUserDetail({ getters, commit }) {
    let query_str = window.location.search;

    // let query_param = this.$router.currentRoute.query;

    const data = getters.apiPayload;
    const { firstName, lastName, email, phone, zipCode, profession, saving, additionalDetail, selected, age, income, } =
      data;
    let endpoint;
    if (query_str) {
      endpoint = `/advisor_matchmaking${query_str}`;
    } else {
      endpoint = `/advisor_matchmaking`;
    }
    return new Promise((resolve, reject) => {
      // Do something here... lets say, a http call using vue-resource
      API.post("MatchMaking", endpoint, {
        body: {
          firstname: firstName,
          lastname: lastName,
          email: email,
          phone: Number(phone),
          zip_code: zipCode,
          investable_assets: saving,
          occupation: profession,
          need_for_advisor: selected,
          additional_detail: additionalDetail,
          age: age,
          income: income,

        },
        response: true,
      }).then(
        (response) => {
          commit("ADVISORS_PROFILE", response.data.top_advisor_matches);
          // commit("ADVISOR_PAGE_STATUS");
          // http success, call the mutator and change something in state
          resolve(response); // Let the calling function know that http is done. You may send some data back
        },
        (error) => {
          // http failed, let the calling function know that action did not work out
          reject(error);
        }
      );
    });
  },
  async checkZipCode({ getters }, payload) {
    console.log(getters);

    return new Promise((resolve, reject) => {
      API.get("MatchMaking", `/check_zip/${payload}`, {
        response: true,
      }).then(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
};

export default actions;
