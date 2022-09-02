<template>
  <!-- Show this if user is logged in -->
  <div v-if="this.$store.state.authenticated" class="w-100 d-flex page-content">
    <!-- Side bar if account tyoe is student -->
    <SideBar v-if="user.is_student">
      <li>
        <router-link :to="{name: 'Take Quiz'}" :class="{active: this.$route.path.slice(0,11) === '/take-quiz/'}"><font-awesome-icon icon="file-signature" title="Take Quiz" /><span>Take Quiz</span></router-link>
      </li>
      <li>
        <router-link :to="{name: 'Activities'}" :class="{active: this.$route.path.slice(0,12) === '/activities/'}"><font-awesome-icon icon="folder-open" title="Activities" /><span>Activities</span></router-link>
      </li>
    </SideBar>
    <!-- Side bar if account type is teacher -->
    <SideBar v-if="user.is_teacher">
      <li>
        <router-link :to="{name: 'My Quizzes'}" :class="{active: this.$route.path.slice(0,12) === '/my-quizzes/'}"><font-awesome-icon icon="server" title="My Quizzes" /><span>My Quizzes</span></router-link>
      </li>
      <li>
        <router-link :to="{name: 'Reports'}"><font-awesome-icon icon="line-chart" title="Reports" /><span>Reports</span></router-link>
      </li>
    </SideBar>
    <router-view class="main-content"/>
  </div>

  <!-- Show this if user is not logged in -->
  <div class="bg-container" v-else>
    <img class="hero-img" src="@/assets/home.png" alt="Hero Image">
    <div class="container">
      <div class="home-content">
        <p class="title">Welcome!</p>
        <p class="subtitle">Kweeznuts is a great tool to conduct online quizzes as it offers convenience to both teachers and students. It allows easy creation of quiz for teachers and simple quiz taking for students.</p>
        <button class="btn btn-main" @click="this.$router.push('/signup')">Get Started</button>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue'

export default {
  name: 'Home',
  components: { SideBar },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
}
</script>

<style>
.page-content {
  height: 100%;
}
.main-content {
  width: 100%;
  position: relative;
  padding: 20px 120px 20px 60px;
}
.main-content h1 {
  font-weight: 600;
}
.bg-container {
  width: 100%;
  height: 100%;
}
.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.home-content {
  width: 30%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.home-content .btn {
  margin-top: 50px;
  font-size: 1.5em;
  font-weight: 400;
  padding: 10px;
  width: 90% !important;
  height: auto !important;
}
p.title {
  font-size: 5em;
  font-weight: 500;
  color: white;
}
p.subtitle {
  margin-top: -10px;
  color: white;
}
@media only screen and (max-width: 992px) {
  .main-content {
    width: 100%;
    padding: 20px 10px !important;
  }
  .home-content {
    text-align: center;
    width: 60%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
}

@media only screen and (max-width: 768px){
  .sidebar{
    min-width: 80px;
    font-size: 25px;
    text-align: center;
  }

  .sidebar li{
    margin-left: -50px;
    margin-top: 30px;
  }

  .sidebar span{
    display: none;
  }
}

@media only screen and (max-width: 576px) {
  .home-content {
    width: 90%;
  }
}
</style>
