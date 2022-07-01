<template>
  <section class="main_section">
    <!-- :src="https://temp-upload-dev.s3.us-east-2.amazonaws.com/output.html?source=iframe" -->
    <iframe
      id="iframe"
      :src="published_link"
      style="width: 100%; background: white"
      frameBorder="0"
      v-if="getIsAdvisorProfileOpen"
    />
    <v-container v-else class="advisorListing">
      <!-- <v-row>
      <v-col class="mb-5">
        <section class="download-section">
          <span
            ><i> 5 Questions </i> to ask in your first meeting with an
            Advisor</span
          >
          <a href="#" class="download-btn">DOWNLOAD PDF</a>
        </section>
      </v-col>
    </v-row> -->
      <v-row>
        <v-col>
          <h1 class="heading mb-sm-5 mt-5">
            We have found your trusted advisors!
          </h1>
        </v-col>
      </v-row>
      <v-row v-if="getAdvisorsProfile.length > 0" class="justify-center">
        <v-col
          cols="12"
          lg="4"
          sm="6"
          v-for="(v, idx) in getAdvisorsProfile"
          :key="idx"
        >
          <section class="advisorProfileSection">
            <div class="head"></div>
            <div class="body">
              <div class="imgBox active">
                <v-avatar height="100px" width="100px" rounded="50px">
                  <img :src="v.profile.picture" />
                </v-avatar>
              </div>
              <div class="details">
                <h5 class="name">{{ getFullName(v) }}</h5>

                <p class="degree">{{ getAddress(v) }}</p>
                <p class="finance">{{ v.firm.firm_name }}</p>
                <p class="distance">
                  {{ getDistanceInMiles(v) }}
                </p>
                <v-btn
                  width="100%"
                  small
                  class="bookBtn"
                  @click="
                    bookNow(
                      v.profile.meetings[0].video_confrence + queryParamNylas
                    )
                  "
                  :disabled="
                    v.profile.meetings[0].video_confrence ? false : true
                  "
                  >BOOK NOW</v-btn
                >
                <div class="ratingView" v-if="v.overall_rating">
                  <template v-if="Number(v.overall_rating) > 0">
                    <span x-small>Overall Rating </span>
                    <v-rating
                      class="starView mb-2"
                      :value="Number(v.overall_rating)"
                      background-color="#85BE05"
                      color="#85BE05"
                      half-increments
                      hover
                      small
                    >
                      <template v-slot:item="props">
                        <v-icon
                          background-color="#85be06 lighten-2"
                          class="engine"
                          color="#85be06"
                          :style="{
                            'background-image':
                              'url(' + getImageSrc(props) + ')',
                          }"
                        >
                        </v-icon> </template
                    ></v-rating>
                    <h1>
                      {{ v.overall_rating }}
                    </h1>
                  </template>
                </div>
                <div class="serviceBox">
                  <div class="serviceDetails">
                    <h6>SERVICES PROVIDED</h6>
                    <ul>
                      <li
                        v-for="(serviceProvided, index) in v.firm
                          .services_provided"
                        :key="index"
                      >
                        {{ serviceProvided }}
                      </li>
                    </ul>
                  </div>
                  <div class="serviceDetails">
                    <h6>CLIENT SERVED</h6>
                    <ul>
                      <li
                        v-for="(clientServed, index) in v.clients.professions"
                        :key="index"
                      >
                        {{ clientServed.profession_name }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="footer">
              <v-btn
                width="100%"
                small
                class="fullProfile"
                @click="viewProfile(v.links.published)"
              >
                FULL PROFILE</v-btn
              >
            </div>
          </section>
        </v-col>
      </v-row>
      <v-row v-else align="center" justify="center">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-row>
      <v-dialog v-model="showBooking" width="960">
        <div style="position: relative">
          <iframe
            id="iframe"
            :src="booking_link"
            style="height: 635px; width: 100%; background: white"
            frameBorder="0"
          />
          <div class="closeButton">
            <v-icon @click="closeBookingModal()">mdi-close</v-icon>
          </div>
        </div>
      </v-dialog>
    </v-container>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  name: "AdvisorListing",
  data: () => ({
    published_link: "",
    booking_link: "",
    showBooking: false,
  }),
  computed: {
    ...mapGetters([
      "getAdvisorsProfile",
      "getIsAdvisorProfileOpen",
      "apiPayload",
    ]),
    ...mapState(["userId"]),
    queryParamNylas() {
      const data = this.apiPayload;
      const { firstName, lastName, email, phone } = data;
      if (process.env.NODE_ENV === "production") {
        return `?name=${firstName} ${lastName}&email=${email}&phone_number=${Number(
          phone
        )}&user_defined_phone_number=${Number(phone)}&user_id=${this.userId}`;
      }
      return `?name=${firstName} ${lastName}&email=${email}&phone_number=${Number(
        phone
      )}&user_defined_phone_number=${Number(phone)}`;
    },
  },
  methods: {
    ...mapState(["advisorsProfile"]),
    ...mapActions(["toggleIsAdvisorProfileOpen"]),
    getImageSrc(props) {
      return props.isFilled
        ? require("@/assets/image/icon-star-full.svg")
        : props.isHalfFilled
        ? require("@/assets/image/icon-star-half.svg")
        : require("@/assets/image/icon-star-empty.svg");
    },
    getFullName(v) {
      return v.profile.firstname + " " + v.profile.lastname;
    },
    getAddress(v) {
      return v.location.city + ", " + v.location.state;
    },
    viewProfile(src) {
      this.published_link = `${process.env.VUE_APP_PUBLISHED_LINK}/${src}?source=iframe`;
      if (process.env.NODE_ENV === "production") {
        this.published_link =
          this.published_link +
          "&" +
          this.queryParamNylas.slice(1, this.queryParamNylas.length);
      }
      this.toggleIsAdvisorProfileOpen();
    },
    closeBookingModal() {
      this.showBooking = false;
      this.booking_link = "";
    },
    bookNow(src) {
      this.booking_link = src;
      this.showBooking = true;
      this.googleTagManagerDataLayer("onclick", "book_now");
    },
    getDistanceInMiles(v) {
      const { nearness } = v;
      if (nearness === "remote") {
        return "Able to work virtually";
      }
      if (nearness === "nearby") {
        return `less than 10 miles away`;
      }
      if (nearness === "local") {
        return `less than 30 miles away`;
      }
      if (nearness === "regional") {
        return `less than 250 miles away`;
      }
    },
    googleTagManagerDataLayer(actionType, eventName) {
      this.$gtm.trackEvent({
        action: actionType,
        event: "prod.matchmaking." + eventName,
        virtual_page_url: `https://${window.location.host}/virtual/${eventName}`
        
      });
    },
  },
  mounted() {
    this.googleTagManagerDataLayer("onload", "matches");
  },
};
</script>
<style lang="scss">
$primary-color: #1c89e6;
$secondary-color: #092d4c;
html {
  overflow-y: auto;
  background-color: transparent;
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  display: none;
}
::-webkit-scrollbar-button:start:decrement,
::-webkit-scrollbar-button:end:increment {
  height: 30px;
  background-color: transparent;
}
::-webkit-scrollbar-track-piece {
  background-color: #3b3b3b;
  border-radius: 16px;
  -webkit-border-radius: 16px;
}
::-webkit-scrollbar-thumb:vertical {
  height: 50px;
  background-color: #666;
  border: 1px solid #eee;
  border-radius: 6px;
  -webkit-border-radius: 6px;
}
.v-dialog {
  box-shadow: none !important;
  .closeButton {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 9;
    cursor: pointer;
  }
}
.v-overlay__scrim {
  background-color: #dadada !important;
}
.heading {
  color: $secondary-color !important;
  font-size: 28px;
  text-align: center !important;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  letter-spacing: -1px;
}
.download-section {
  background: #ffffff;
  border: 1px solid #dde4e9;
  border-radius: 10px;
  padding: 15px;
  span {
    color: #092d4c;
    i {
      font-weight: 100 !important;
      opacity: 0.6;
    }
  }
  .download-btn {
    color: #1f99ff;
    border: 1px solid #1f99ff;
    display: inline-block;
    padding: 10px 20px;
    border-radius: 4px;
    margin-left: 20px;
    text-decoration: none;
    font-size: 12px;
  }
}
.container {
  max-width: 1035px !important;
}
.advisorProfileSection {
  border: 1px solid #edf1f5;
  border-radius: 20px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 35px 0 #edf1f5;
  $primary-color: #1f99ff;
  max-width: 320px;
  margin: 0 auto;
  .head {
    height: 60px;
    background: $primary-color url("../assets/image/advisor-head-bg.svg");
    background-position: right;
    background-repeat: no-repeat;
  }
  .body {
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: column;
    .imgBox {
      width: 100px;
      height: 100px;
      margin: 0 auto;
      margin-top: -50px;
      border-radius: 50%;
      background: #ccc;
      &.active {
        position: relative;
        &::before {
          content: "";
          height: 25px;
          width: 25px;
          position: absolute;
          background: #85be05 url("../assets/image/tick.svg");
          background-position: center;
          background-size: contain;
          background-repeat: no-repeat;
          z-index: 1;
          border-radius: 50%;
          left: 0px;
          top: 5px;
        }
      }
    }
    .details {
      padding: 0 15px 0;
      display: flex;
      flex-direction: column;
      flex: 1;
      .name {
        font-style: normal;
        font-weight: 700;
        font-size: 18px;
        line-height: 25px;
        /* identical to box height */

        text-align: center;

        color: #092d4c;
        margin: 0;
        margin-top: 10px;
        font-family: "Montserrat", sans-serif;
      }
      .degree {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 19px;
        /* identical to box height */
        color: #092d4c;
        margin: 0;
        font-family: "Open Sans", sans-serif;
      }
      .finance {
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        color: #818d98;
        margin: 0;
        font-family: "Open Sans", sans-serif;
      }
      .distance {
        font-weight: 600;
        font-size: 11px;
        line-height: 15px;
        text-align: center;
        color: #818d98;
        margin: 5px;
        font-family: "Open Sans", sans-serif;
      }
      .bookBtn {
        margin: 10px 0;
        background: #85be05;
        color: #fff;
        font-size: 12px;
        height: 38px;
        font-family: "Montserrat", sans-serif;
        font-weight: 600;
        .v-btn__content {
          color: #fff;
        }
      }
      .ratingView {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 15px;
        justify-content: space-around;
        padding-left: 1rem;
        padding-right: 1rem;
      }
      .ratingView > span {
        font-size: small;
        font-weight: 600;
      }
      .ratingView .v-rating > button {
        padding: 0 0 5px 0;
        margin: 1px;
      }
      .fullProfile {
        margin: 0;
        background: transparent;
        color: #818d98;
        font-size: 12px;
        border: 1px solid #818d98;
      }
      .serviceBox {
        display: flex;
        flex-direction: column;
        flex: 1;
        .serviceDetails {
          background: #f4f7fa;
          border: 4px;
          color: #818d98;
          padding: 10px;
          margin-bottom: 10px;
          flex: 1;
          border-radius: 10px;
          h6 {
            font-size: 10px;
            font-weight: 600;
          }
          ul {
            display: flex;
            flex-wrap: wrap;
            margin-top: 10px;
            padding-left: 10px;
            li {
              width: 50%;
              padding: 2px 10px;
              font-size: 11px;
              text-align: left;
              list-style-type: none;
              position: relative;
              overflow-wrap: break-word;
              font-weight: 400;
              &::before {
                content: "";
                position: absolute;
                left: 0;
                top: 8px;
                background: #aaa;
                border-radius: 50%;
                height: 4px;
                width: 4px;
              }
            }
          }
        }
      }
    }
  }
  .footer {
    padding: 0 15px 15px;
    .theme--light.v-btn.v-btn--has-bg {
      background: none;
      border: 1px solid #818d98;
      color: #818d98;
      height: 36px;
      .v-btn__content {
        font-weight: 700;
        font-family: "Montserrat", sans-serif;
        letter-spacing: 0px;
      }
    }
  }
}
.main_section {
  background: #fff;
}
iframe {
  height: calc(100vh - 100px);
}
</style>
