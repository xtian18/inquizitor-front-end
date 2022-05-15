<template>
  <teleport to="#app">
    <div class="modal-overlay" v-if="showHelp">
      <div class="modal-container d-flex flex-column">
        <div class="modal-head text-center">
          <slot name="head">Header</slot>
        </div>
        <div class="modal-body">
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
  padding: 20px 10px;
  width: 70% !important;
  height: auto;
}
.modal-head {
  width: 100%;
}
.modal-body {
  width: 100%;
  padding: 0.5rem !important;
}
.modal-foot {
  width: 100%;
}
</style>