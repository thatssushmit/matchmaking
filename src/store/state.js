import secureStorage from "../utils/webStorage";
import { v4 as uuidv4 } from 'uuid';

const getForms = () => {
  return secureStorage.getItem("forms");
};

const getStep = () => {
  return secureStorage.getItem("getStep") ? secureStorage.getItem("getStep") : 0
};

const getAdvisorsProfile = () => {
  return secureStorage.getItem("getAdvisorsProfile") ? secureStorage.getItem("getAdvisorsProfile") : []
};
const getAdvisorsPageStatus = () => {
  return secureStorage.getItem("getAdvisorsPageStatus") ? true : false
};


const getUserId = () => {
  if(secureStorage.getItem("userId")){
    return secureStorage.getItem("userId")
  }
  else {
    const userId = uuidv4().toString()
    secureStorage.setItem("userId",userId)
    return userId
  }
}
const getVisitorJobId = () => {
  return secureStorage.getItem("visitorJobId") ? secureStorage.getItem("visitorJobId") : null;

}

var forms = getForms()

const getAnswer = () => {
  let answerInfo = [];
  if (forms) {
    answerInfo = forms;
  }

  return answerInfo;
};



const state = () => ({
  step: getStep(),
  answers: getAnswer(),
  advisorsProfile: getAdvisorsProfile(),
  visitorJobId: getVisitorJobId(),
  userId:getUserId(),
  isAdvisorProfileOpen: false,
  isAdvisorPage: getAdvisorsPageStatus(),
  matchmakingVersion: 0,
});

export default state;