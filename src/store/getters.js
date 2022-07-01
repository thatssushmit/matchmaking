const getters = {
  currentStep: (state) => {
    return state.step;
  },
  getAnswers: (state) => {
    if (state.answers) {
      return state.answers[state.step];
    }
    return null;
  },
  apiPayload: (state) => {
    if (state.answers) {
      return {
        ...state.answers[0],
        ...state.answers[1],
        ...state.answers[2],
        ...state.answers[3],
        ...state.answers[4],
        ...state.answers[5],
        ...state.answers[6],
        ...state.answers[7],
      };
    }
    return null
  },
  getAdvisorsProfile: (state) => {
    if (state.advisorsProfile) {
      return state.advisorsProfile
    }
    return []
  },
  getVisitorJobId: (state) => {
    if (state.visitorJobId) {
      return state.visitorJobId
    }
    return null
  },
  getIsAdvisorProfileOpen: (state) => {
    return state.isAdvisorProfileOpen
  },
  getAdvisorStatus: (state) => {
    return state.isAdvisorPage
  },
  getScreenType: () => {
    return window.innerWidth > 768
      ? "desktop"
      : window.innerWidth > 500
        ? "tab"
        : "mobile";
  }
  ,
  getmatchmakingVersion: (state) => {
    return state.matchmakingVersion
  },
};

export default getters;
