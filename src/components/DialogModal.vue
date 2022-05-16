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
.modal-container {
  padding: 20px 50px;
  width: auto !important;
  min-width: 560px;
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
@media only screen and (max-width: 576px) {
  .modal-container {
    min-width: 500px;
  }
}
</style>