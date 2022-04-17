<template>
  <div>
    <h1>Update Profile</h1>
    <div class="form-container mt-3">
      <div class="img-upload">
        <img src="@/assets/profile.jpg" alt="Profile Image">
        <div class="round" v-show="isFormEnabled">
          <input type="file">
          <font-awesome-icon icon="upload" />
        </div>
      </div>
      <div class="form-group pb-3">
        <label for="username">Username:</label>
        <input type="text" id="username" value="Jaehyun" placeholder="Enter new email" :disabled="isFormEnabled === false">
      </div>
      <div class="form-group pb-3">
        <label for="password">Password:</label>
        <input type="password" id="password" value="123456" placeholder="Enter new password" :disabled="isFormEnabled === false">
      </div>
      <div class="text-center pt-3">
        <button type="submit" class="btn" v-if="isFormEnabled" @click="formToggle">Save</button>
        <button type="button" class="btn" v-else @click="formToggle">Update</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFormEnabled: false
    }
  },
  methods: {
    formToggle() {
      this.isFormEnabled = !this.isFormEnabled
    }
  }
}
</script>

<style scoped>
.form-container {
  width: 40%;
  padding: 50px;
}
.img-upload {
  position: relative;
  width: 150px;
  height: 150px;
  margin: auto;
}
.img-upload img {
  width: 100%;
  height: 100%;
  border-radius: 100px;
  margin-bottom: 10px;
}
.img-upload .round {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #f6a427;
  color: white;
  width: 32px;
  height: 32px;
  line-height: 33px;
  border-radius: 50%;
  text-align: center;
  overflow: hidden;
}
.img-upload .round input[type='file'] {
  position: absolute;
  transform: scale(2);
  opacity: 0;
}

input[type=file]::-webkit-file-upload-button {
  cursor: pointer;
}
</style>