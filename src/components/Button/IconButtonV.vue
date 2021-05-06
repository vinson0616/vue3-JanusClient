<template>
  <div class="iconButtonV">
    <div class="text-center">
      <img class="text-center" width="32" height="32" :src="url" />
    </div>
    <div class="text-center">
      <span style="font-size: 0.812rem">{{text}}</span>
    </div>
  </div>
</template>
<script lang="js">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'IconButtonV',
  props: {
    text: {
      type: String,
      required: true,
      default: 'Test'
    },
    url: {
      type: String
    }
  },
  setup (props) {
    //
  }
})
</script>
<style lang="scss" scoped>
.iconButtonV {
  max-width: 100px;
  width: auto;
  height: 52px;
  cursor: pointer;
}
</style>
