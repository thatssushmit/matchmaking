<template>
  <div class="noob-progress">
    <span
      :class="`progress ${
        percentage <= 0 || percentage >= 100 ? 'hideCount' : ''
      }`"
      :style="`width:${percentage <= 0 ? 0 : percentage >= 100 ? 100 : percentage}%`"
      :data-counter="`${percentage}%`"
    ></span>
  </div>
</template>
<script>
export default {
  props: ["percentage"],
  mounted() {},
};
</script>

<style lang="scss" scoped>
.noob-progress {
  margin-bottom: 0px;
  width: 100%;
  height: 10px;
  background: #dde4e9;
  position: absolute;
  top: 0;
  .progress {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: #85be05;
    transition: 1s;
    &::before {
      content: "|";
      position: absolute;
      right: -3px;
      top: 5px;
      font-size: 14px;
      color: #c8d1d8;
    }
    &::after {
      content: attr(data-counter);
      position: absolute;
      right: -13px;
      top: 25px;
      font-size: 14px;
      color: #c8d1d8;
    }

    &.hideCount {
      &::before,
      &::after {
        display: none;
      }
    }
  }
}
</style>