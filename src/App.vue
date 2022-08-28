<template>
    <div 
      class="app-container" 
      @click="click" 
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
    </div>
</template>

<script>
import "@/assets/main.css"
import NavBar from '@/components/NavBar.vue'

export default {
  components: { NavBar },
  data() {
    return {
      counter: 0,
    }
  },
  computed: {
    is_taking() {
      const url = this.$route.path
      return url.slice(0,11) === '/take-quiz/' && url.length < 18 ? true : false
    }
  },
  methods: {
    async sendInputData(event) {
      const data = {[event]: 1};

      try {
        const response = await fetch("http://localhost:8000/quizzes/" + localStorage.quiz_id + "/questions/" + localStorage.question_id + "/actions", {
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
    click() {
      if(this.is_taking) {
        this.counter++;
        
        if(this.counter == 1) {
          this.timer = setTimeout(() => {
              this.counter = 0;
              this.sendInputData('left_click')
          }, 500);

          return;
        }
        
        clearTimeout(this.timer);  
        this.counter = 0;
        this.sendInputData('double_click') 
      }
    },
    sendRightClick() {
      if(this.is_taking) {
        this.sendInputData('right_click')
      }
    },
    sendFocus() {
      if(this.is_taking) {
        this.sendInputData('focus')
      }
    },
    sendBlur() {
      if(this.is_taking) {
        this.sendInputData('blur')
      }
    },
    sendCopy() {
      if(this.is_taking) {
        this.sendInputData('copy_')
      }
    },
    sendPaste() {
      if(this.is_taking) {
        this.sendInputData('paste')
      }
    },
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
.app-container {
  height: 100%;
}
</style>
