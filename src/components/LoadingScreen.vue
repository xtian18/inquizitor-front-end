<template>
  <div class="loading-screen">
    <div class="loading-image text-center">
      <img src="@/assets/robot-head.png" alt="" class="icon mb-1">
      <img src="@/assets/loading.gif" alt="" class="gif mx-auto">
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>

.loading-screen {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #d1d7e0;
  z-index: 100;
  width: 100%;
  height: 100%;
}
.loading-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25%;
}
.icon {
  max-width: 100%;
}
.gif {
  max-width: 50%;
}

@media only screen and (min-width: 768px) {
  .loading-image {
    width: 15%;
  }
}

@media only screen and (min-width: 992px) {
  .loading-image {
    width: 10%;
  }
}
</style>