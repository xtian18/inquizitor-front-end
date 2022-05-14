<template>
<div class="container">
  <div class="form-container">
    <h1 class="text-center">Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group pb-3">
        <label for="username">Username:</label>
        <input type="text" id="username" placeholder="Enter username" v-model="username">
      </div>
      <div class="form-group pb-3">
        <label for="password">Password:</label>
        <input type="password" id="password" placeholder="Enter Password" v-model="password">
        <!-- {{ this.$store.state.msg.detail }} -->
      </div>
      <div class="text-center pt-3">
        <button class="btn btn-main" type="submit">Login</button>
      </div>
    </form>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'

  export default {
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      ...mapActions({
        signIn: 'signIn'
      }),
      async handleLogin() {  
        let formData = new FormData();
        formData.append('username', this.username)
        formData.append('password', this.password)

        this.signIn(formData)
        this.checkMessage();
        // this.$router.push('/')
        
      },
      checkMessage() {
        // if(this.$store.state.message.msg = 'Successfully logged in.') {
        //   console.log('Successfully logged in.')
        // } else if(this.$store.state.message.detail == 'Incorrent user or password') {
        //   console.log('Incorrent user or password')
        // }
      },
      async getUser() {
        try {
          const response = await fetch('http://localhost:8000/users/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credetials': 'true'
            },
            credentials: 'include'
            });
            const data = await response.json();
            console.log(data)
        } catch(e) {
          console.log(e);
        }
      }
    }
  }
</script>

<style>

</style>