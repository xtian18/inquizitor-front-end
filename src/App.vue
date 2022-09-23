<template>
    <div
      class="app-container" 
      @dblclick="sendDoubleClick" 
      @click="sendLeftClick"
      @mouseleave="sendBlur"
      @mouseenter="sendFocus"
      @copy="sendCopy"
      @contextmenu="sendRightClick"
      >
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

        <teleport to="#app">
          <LoadingScreen v-if="showLoadingScreen"></LoadingScreen>
        </teleport>
    </div>
</template>

<script>
import '@/assets/main.css'
import config from '../config'
import NavBar from '@/components/NavBar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

export default {
  components: { NavBar, LoadingScreen },
  data() {
    return {
      counter: 0,
      is_double_click: false,
      in_progress: false,
    }
  },
  computed: {
    is_taking() {
      const url = this.$route.path
      return url.slice(0,11) === '/take-quiz/' && url.length < 18 ? true : false
    },
    showLoadingScreen() {
      return this.$store.state.showLoadingScreen
    },
    quizStarted() {
      return this.$store.state.quizStarted
    }
  },
  methods: {
    async sendInputData(event) {
      const data = {[event]: 1};

      try {
        const response = await fetch(`${config.apiURL}/quizzes/${localStorage.quiz_id}/questions/${localStorage.question_id}/actions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
          body: JSON.stringify(data)
        });
        console.log(await response.json())
      } catch(e) {
        // console.log(e)
      }
    },
    sendLeftClick() {
      if(this.is_taking) {
        this.timer = setTimeout(() => {
          if(!this.is_double_click) {
            // console.log('left_click')
            this.sendInputData('left_click')
          }
        }, 500);
      }
    },
    sendDoubleClick() {
      if(this.is_taking) {
        this.is_double_click = true
        // console.log('double_click')
        this.sendInputData('double_click')
        const timer = setTimeout(() => {
          this.is_double_click = false
        }, 500);
      }
    },
    sendRightClick() {
      if(this.is_taking) {
        // console.log('right_click')
        this.sendInputData('right_click')
      }
    },
    async sendFocus() {
      if(this.is_taking) {
        if(this.quizStarted) {
          if(!this.in_progress) {
            this.in_progress = true
            // console.log('focus')
            const focus = await this.sendInputData('focus')
            this.in_progress = false
          }
        } else {
          this.$store.commit('SET_QUIZ_STARTED', true);
        }
      }
    },
    async sendBlur() {
      if(this.is_taking) {
        if(!this.in_progress) {
          this.in_progress = true
          // console.log('blur')
          const blur = await this.sendInputData('blur')
          this.in_progress = false
        }
      }
    },
    sendCopy() {
      if(this.is_taking) {
        // console.log('copy')
        this.sendInputData('copy_')
      }
    },
    async handleLogout() {
      try {
        const check_token = await fetch(`${config.apiURL}/login/logout`, {
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
        const response = await fetch(`${config.apiURL}/users/profile`, {
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
.app-container {
  height: 100%;
}
</style>
