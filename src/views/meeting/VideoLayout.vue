<template>
<div class="VideoLayout h-100 w-100">
  <div class="itemRow" :style="{ height: users.length > 1 ? '50%' : '100%' }">
    <div class="videoItem" v-for="item in users.slice(0, Math.ceil(users.length / 2))" :key="item">
      <video autoplay :srcObject="item.stream"/>
      <div class="info">
        <img src="@/assets/Icons_Profile.svg" alt="catpure" />
        {{ item.userName }}
      </div>
    </div>
  </div>
  <div class="itemRow" style="height: 50%" v-if="users.length > 1">
    <div class="videoItem" v-for="item in users.slice(Math.ceil(users.length / 2), users.length)" :key="item">
      <video autoplay :srcObject="item.stream"/>
      <div class="info">
        <img src="@/assets/Icons_Profile.svg" alt="catpure" />
        {{ item.userName }}
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'VideoLayout',
  props: {
    users: {
      type: Array,
      default: () => { return [] }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/design";
.VideoLayout {
  background: white;
  flex: 1;
  .itemRow {
    display: flex;
    height: 100%;
    .videoItem {
      flex: 1;
      background: #B7B7B7;
      position: relative;
      video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background-color: black;
        position: absolute;
        margin: 0 auto;
      }
      .info {
        position: absolute;
        background: rgba(0,0,0,0.5);
        padding: 0 16px;
        color: white;
        width: auto;
        height: 30px;
        bottom: 5px;
        left: 48%;
      }
    }
  }
}
</style>
