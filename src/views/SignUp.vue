<template>
<div class="container">
  <div class="form-container">
    <h1 class="text-center">Sign Up</h1>
    <form @submit.prevent="handleSubmit">
      <div v-if="is_invalid" class="mb-2">
        <ErrorMessage>
          {{ message }}
        </ErrorMessage>
      </div>
      <div class="form-group pb-2">
        <label for="username">Username: <span class="text-invalid" v-if="user_missing">(required)</span></label>
        <input v-model="username" type="text" class="form-control" id="username" placeholder="Enter username" :class="{invalid: invalid_username}">
      </div>
      <div class="form-group pb-2">
        <label for="email">Email: <span class="text-invalid" v-if="email_missing">(required)</span></label>
        <input v-model="email" type="email" class="form-control" id="email" placeholder="Enter email" :class="{invalid: invalid_email}">
      </div>
      <div class="d-flex w-100">
        <div class="flex-fill form-group pb-2">
          <label for="first_name">First Name: <span class="text-invalid" v-if="fname_missing">(required)</span></label>
          <input v-model="first_name" type="text" class="form-control" id="first_name" placeholder="Enter first name" :class="{invalid: fname_missing}">
        </div>
        <div class="flex-fill form-group pb-2 ms-2">
          <label for="last_name">Last Name: <span class="text-invalid" v-if="lname_missing">(required)</span></label>
          <input v-model="last_name" type="text" class="form-control" id="last_name" placeholder="Enter last name" :class="{invalid: lname_missing}">
        </div>
      </div>
      <div class="d-flex w-100">
        <div class="flex-fill form-group pb-2">
          <label for="password">Password: <span class="text-invalid" v-if="password_missing">(required)</span></label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter password" :class="{invalid: invalid_pass}">
        </div>
        <div class="flex-fill form-group pb-2 ms-2">
          <label for="confirm_password">Confirm Password: <span class="text-invalid" v-if="confirm_missing">(required)</span></label>
          <input v-model="confirm_password" type="password" class="form-control" id="confirm_password" placeholder="Confirm password" :class="{invalid: invalid_confirm}">
          
        </div>
      </div>
      <div class="form-group pb-2">
        <label for="account">Account Type: <span class="text-invalid" v-if="type_missing">(required)</span></label>
        <select v-model="accountType" class="form-control" id="account" :class="{invalid: type_missing}">
          <option value="" disabled selected>Select account type</option>
          <option value="0">Student</option>
          <option value="1">Teacher</option>
        </select>
      </div>
      <div class="text-center pt-2">
        <button type="submit" class="btn btn-main">Sign Up</button>
      </div>
    </form>
  </div>
</div>
</template>

<script>
import ErrorMessage from '@/components/ErrorMessage.vue'
import config from '../../config'

export default {
  components: { ErrorMessage },
  data() {
    return {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      confirm_password: '',
      accountType: '',

      is_invalid: false,
      not_match: false,
      user_missing: false,
      user_exist: false,
      email_missing: false,
      email_exist: false,
      fname_missing: false,
      lname_missing: false,
      password_missing: false,
      confirm_missing: false,
      type_missing: false,
      message: ''
    }
  },
  computed: {
    invalid_username() {
      return this.user_missing || this.user_exist;
    },
    invalid_email() {
      return this.email_missing || this.email_exist;
    },
    invalid_pass() {
      return this.password_missing || this.not_match;
    },
    invalid_confirm() {
      return this.confirm_missing || this.not_match;
    }
  },
  methods: {
    async handleSubmit() {
      this.reset();
      //check for empty fields
      if (!this.username) {
        this.is_invalid = true;
        this.message = "Incomplete details. Please fill out all necessary information."
        this.user_missing = true;
      }
      if (!this.email) {
        this.is_invalid = true;
        this.message = "Incomplete details. Please fill out all necessary information."
        this.email_missing = true;
      }
      if (!this.first_name) {
        this.is_invalid = true;
        this.message = "Incomplete details. Please fill out all necessary information."
        this.fname_missing = true;
      }
      if (!this.last_name) {
        this.is_invalid = true;
        this.message = "Incomplete details. Please fill out all necessary information."
        this.lname_missing = true;
      }
      if (!this.password) {
        this.is_invalid = true;
        this.message = "Incomplete details. Please fill out all necessary information."
        this.password_missing = true;
      }
      if (!this.confirm_password) {
        this.is_invalid = true;
        this.message = "Incomplete details. Please fill out all necessary information."
        this.confirm_missing = true;
      }
      if (!this.accountType) {
        this.is_invalid = true;
        this.message = "Incomplete details. Please fill out all necessary information."
        this.type_missing = true;
      }
      //check for password
      if (!this.is_invalid) {
        if (this.password != this.confirm_password) {
          this.is_invalid = true;
          this.not_match = true;
          this.message = 'Please make sure your password match.'
        }
      }
      //register
      if (!this.is_invalid) {
        const result = await this.register();
      }
    },
    async register() {
      const formData = new FormData();

      formData.append('username', this.username)
      formData.append('email', this.email)
      formData.append('full_name', this.last_name + "' " + this.first_name)
      formData.append('is_superuser', false)
      formData.append('last_name', this.last_name)
      formData.append('first_name', this.first_name)
      if(this.accountType == 0) {
        formData.append('is_teacher', false)
        formData.append('is_student', true)
      } else {
        formData.append('is_teacher', true)
        formData.append('is_student', false)
      }
      formData.append('password', this.password)

      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      try {
        const response = await fetch(`${config.apiURL}/users`, {
          method: 'POST',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
        const new_user = await response.json();
        
        if(response.ok) {
          this.$router.push('/login')
        } else {
          this.is_invalid = true;
          this.message = new_user.detail;
          if (this.message.charAt(19) == 'u') {
            this.user_exist = true;
          } else if (this.message.charAt(19) == 'e') {
            this.email_exist = true;
          }
        }
      } catch(e) {

      }
    },
    reset() {
      this.is_invalid = false;
      this.not_match = false;
      this.user_missing = false;
      this.user_exist = false;
      this.email_missing = false;
      this.email_exist = false;
      this.fname_missing = false;
      this.lname_missing = false;
      this.password_missing = false;
      this.confirm_missing = false;
      this.type_missing = false;
    }
  }
}
</script>

<style scoped>
.form-container {
  padding: 40px 50px;
  min-width: 600px;
}
.form-container input {
    height: 40px;
}
</style>