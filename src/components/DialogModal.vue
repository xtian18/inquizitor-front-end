<template>
  <teleport to="#app">
    <div class="modal-overlay" v-if="showDialog">
      <div class="modal-container d-flex flex-column">
        <div class="modal-head text-center">
          <slot name="head">Header</slot>
        </div>
        <div class="modal-body text-center">
          <slot name="body">Body</slot>
        </div>
        <div class="modal-foot text-center">
          <slot name="foot">Footer</slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export default {
  props: ["showDialog"],
  data() {
    return {};
  },
};
</script>

<style scoped>
.btn {
  float: none !important;
}
.modal-container {
  padding: 20px 50px;
  width: auto;
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