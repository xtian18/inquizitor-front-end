<template>
  <teleport to="#app">
    <div class="modal-overlay" v-if="showHelp">
      <div class="modal-container d-flex flex-column">
        <div class="modal-head">
          <slot name="head">Header</slot>
        </div>
        <div class="modal-body text-center">
          <slot name="body">Body</slot>
        </div>
        <div class="modal-foot">
          <slot name="foot">Footer</slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  props: ["showHelp"],
  data() {
    return {};
  },
};
</script>

<style scoped>
.modal-container {
  padding: 20px 50px;
  width: 80%;
  height: auto;
}
.modal-head {
  width: 100%;
}
.modal-body {
  width: 100%;
}
.modal-foot {
  width: 100%;
}
</style>