<template>
  <NavBar>
    <ul class="navbar-nav">
            <li class="nav-item">
            <router-link :to="{name: 'LogIn'}" class="nav-link" aria-current="page">Login</router-link>
            </li>
            <li class="nav-item">
            <router-link :to="{name: 'SignUp'}" class="nav-link" aria-current="page">Sign Up</router-link>
            </li>
        </ul>
  </NavBar>
  <router-view/>
</template>

<script>
import "@/assets/main.css"
import NavBar from '@/components/NavBar.vue'

export default {
  components: { NavBar }
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
  color: #2d283e;
}
</style>
