import secureStorage from "../utils/webStorage";
import Vue from "vue";
const getForms = async () => {
  try {
    const value = await secureStorage.getItem("forms");
    return value;
  } catch (err) {
    return [];
  }
};

const updateLocalStorageArray = (state, value) => {
  let forms;
  getForms()
    .then((res) => {
      forms = res;
    })
    .then(() => {
      forms = forms ? forms : [];
      // Add new data to localStorage Array
      if (forms) {
        forms[state.step] = value;
      } else {
        forms.push(value);
      }

      // Save back to localStorage
      secureStorage.setItem("forms", forms);
    });
};

const updateStepInLocalStorage = (value) => {
  secureStorage.setItem("getStep", value);
};

const deleteStateData = (state) => {
  state.answers = [];
};
const deleteLocalStorageArray = () => {
  secureStorage.removeItem("forms");
};

const deleteLocalAdvisorsProfile = () => {
  secureStorage.removeItem("getAdvisorsProfile");

}

const deleteStepInLocalStorage = () => {
  secureStorage.setItem("getStep", 0);
};

const updateStateAnswer = (state, value) => {
  Vue.set(state.answers, state.step, value);
};

const updateAdvisorsProfile = (value) => {
  secureStorage.setItem("getAdvisorsProfile", value);
}
const updateAdvisorsPageStatus = (value) => {
  secureStorage.setItem("getAdvisorsPageStatus", value);
}



const mutations = {
  NEXT_STEP(state, value) {
    state.step = value;
    updateStepInLocalStorage(value);
  },
  PREVIOUS_STEP(state, value) {
    state.step = value;
    updateStepInLocalStorage(value);
  },
  UPDATE_OR_ADD_ANSWER(state, value) {
    updateStateAnswer(state, value);
    updateLocalStorageArray(state, value);
  },
  DELETE_DATA(state) {
    state.step = 0;
    state.advisorsProfile = [];
    if (state.isAdvisorPage) {
      state.isAdvisorPage = false;
    }
    deleteStateData(state);
    deleteLocalStorageArray();
    deleteStepInLocalStorage();
    deleteLocalAdvisorsProfile();
    secureStorage.setItem("getAdvisorsPageStatus", false);
  },
  IS_ADVISOR_PROFILE_OPEN(state) {
    state.isAdvisorProfileOpen = !state.isAdvisorProfileOpen;
    // updateAdvisorsProfile(state.isAdvisorProfileOpen);
  },
  ADVISORS_PROFILE(state, value) {
    state.advisorsProfile = value;
    updateAdvisorsProfile(value)
  },
  VISITOR_JOB_ID(state, value) {
    state.visitorJobId = value;
    secureStorage.setItem("visitorJobId", value);
  },
  ADVISOR_PAGE_STATUS(state) {
    state.isAdvisorPage = !state.isAdvisorPage;
    updateAdvisorsPageStatus(state.isAdvisorPage)
  },
  MATCHMAKING_VERSION(state, value) {
    state.matchmakingVersion = value;
  },
};

export default mutations;
