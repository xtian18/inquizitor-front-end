<template>
<div class="container">
  
  <div class="form-container">

    <h1 class="text-center">Login</h1>
    
    <form @submit.prevent="handleLogin">
      <div v-if="is_invalid" class="mb-2">
        <ErrorMessage>
          {{ message }}
        </ErrorMessage>
      </div>
      <div class="form-group pb-3">
        <label for="username">Username: <span class="text-invalid" v-if="user_missing">(required)</span></label>
        <input type="text" id="username" placeholder="Enter username" v-model="username" :class="{invalid: user_missing}">
      </div>
      <div class="form-group pb-3">
        <label for="password">Password: <span class="text-invalid" v-if="password_missing">(required)</span></label>
        <input type="password" id="password" placeholder="Enter Password" v-model="password" :class="{invalid: password_missing}">
        
      </div>
      <div class="text-center pt-3">
        <button class="btn btn-main" type="submit" :disabled="is_loading">
          <div v-if="is_loading" class="spinner-border spinner-border-sm"></div>
          Login
        </button>
      </div>
    </form>

  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import config from '../../config'
import ErrorMessage from '@/components/ErrorMessage.vue'

export default {
  components: { ErrorMessage },
  data() {
    return {
      username: '',
      password: '',
      is_invalid: false,
      user_missing: false,
      password_missing: false,
      message: '',
      is_loading: false
    }
  },
  methods: {
    ...mapActions({
      attempt: 'attempt'
    }),
    async handleLogin() {
      this.is_loading = true
      this.reset();
      let formData = new FormData();
      formData.append('username', this.username)
      formData.append('password', this.password)

      try {
        const check_token = await fetch(`${config.apiURL}/login/token`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        const login = await check_token.json();
        if(check_token.ok) {
          this.$store.commit('SET_SHOW_LOADING_SCREEN', true);
          this.is_loading = false;
          const response = await this.attempt(login);
          this.$router.push('/');
        } else if(check_token.status == 400) {
          this.is_invalid = true;
          this.message = login.detail;
          this.is_loading = false;
        } else if(check_token.status == 422) {
          this.is_invalid = true;
          this.message = 'Incomplete details';
          if (login.detail.filter(e => e.loc[1] === 'username').length > 0) {
            this.user_missing = true;
          }
          if (login.detail.filter(e => e.loc[1] === 'password').length > 0) {
            this.password_missing = true;
          }
          this.is_loading = false;
        }
      } catch (e) {
        this.is_loading = false
        // console.log(e);
      }
    },
    reset() {
      this.is_invalid = false;
      this.user_missing = false;
      this.password_missing = false;
    }
  }
}
</script>

<style scoped>
.form-container {
  min-width: 400px;
}
</style>