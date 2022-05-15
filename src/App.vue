<template>
    <NavBar>
      <!-- if logged in -->
      <ul class="navbar-nav" v-if="!this.$store.state.authenticated">
        <li class="nav-item">
          <router-link :to="{name: 'LogIn'}" class="nav-link" aria-current="page">Login</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name: 'SignUp'}" class="nav-link" aria-current="page">Sign Up</router-link>
        </li>
      </ul>
      <!-- if logged out -->
      <ul class="navbar-nav" v-else>
        <li class="nav-item">
          <a href="#" @click="handleLogout">Logout</a>
        </li>
      </ul>
    </NavBar>
    <router-view/>
</template>

<script>
import "@/assets/main.css"
import NavBar from '@/components/NavBar.vue'

export default {
  components: { NavBar },
  methods: {
    async handleLogout() {
      try {
        const check_token = await fetch('http://localhost:8000/login/logout', {
          method: 'POST',
          credentials: 'include'
          });
        const data = await check_token.json();
        this.$store.commit('SET_MSG', data.msg);
        this.$store.commit('SET_AUTHENTICATED', false);
        this.$router.push('/');
      } catch(e) {

      }
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
           
          if(response.ok){
            this.$store.commit('SET_AUTHENTICATED', true);
            const current_user = await response.json();
            this.$store.commit('SET_USER', current_user);
          }else{
            this.$store.commit('SET_AUTHENTICATED', false);
          }
      } catch(e) {
        // console.log(e);
      }
    }
  },
  created() {
    this.getUser();
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #d1d7e0;
  color: #272A3F;
}
</style>
