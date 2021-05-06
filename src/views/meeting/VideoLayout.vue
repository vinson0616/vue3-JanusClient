<template>
  <div class="VideoLayout h-100 w-100">
    <div class="itemRow" :style="{ height: users.length > 1 ? '50%' : '100%' }">
      <div class="videoItem" v-for="item in users.slice(0, Math.ceil(users.length / 2))" :key="item">
        <video autoplay :srcObject="item.stream"/>
        <div class="info">
          <img src="@/assets/mic-mute-fill.svg" alt="catpure" v-if="item.muted" />
          {{ item.userName }}
        </div>
      </div>
    </div>
    <div class="itemRow" style="height: 50%" v-if="users.length > 1">
      <div class="videoItem" v-for="item in users.slice(Math.ceil(users.length / 2), users.length)" :key="item">
        <video autoplay :srcObject="item.stream"/>
        <div class="info">
          <img src="@/assets/mic-mute-fill.svg" alt="catpure" v-if="item.muted" />
          {{ item.userName }}
        </div>
      </div>
    </div>
    <div class="talking" v-if="talking">
      Talking: {{ talking }}
    </div>
    <div>
      <audio width="100%" height="100%" autoPlay :srcObject="audioStream"/>
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
    },
    talking: {
      type: String,
      default: ''
    },
    audioStream: {
      type: Object
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
  .talking {
    color: white;
    position: absolute;
    background: rgba(0,0,0,0.5);
    margin-top: 10px;
    padding: 5px 16px;
    left: 48%;
    top: 0;
  }

}
</style>
