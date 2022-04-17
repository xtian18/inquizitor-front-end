<template>
  <!-- Show this if user is logged in -->
  <div v-if="isLoggedIn" class="w-100 d-flex page-content">
    <!-- Side bar if account tyoe is student -->
    <SideBar v-if="accountType === 'student'">
      <li>
        <router-link :to="{name: 'TakeExam'}"><font-awesome-icon icon="file-signature" />Take Exam</router-link>
      </li>
      <li>
        <router-link :to="{name: 'Activities'}"><font-awesome-icon icon="folder-open" />Activities</router-link>
      </li>
    </SideBar>
    <!-- Side bar if account tyoe is teacher -->
    <SideBar v-else>
      <li>
        <router-link :to="{name: 'MyExams'}"><font-awesome-icon icon="server" />My Exams</router-link>
      </li>
      <li>
        <router-link :to="{name: 'Reports'}"><font-awesome-icon icon="line-chart" />Reports</router-link>
      </li>
    </SideBar>
    <router-view class="main-content"/>
  </div>

  <!-- Show this if user is not logged in -->
  <div v-else class="page-container">
    <div class="container">
      <h1>This is home :)</h1>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue'

export default {
  name: 'Home',
  components: { SideBar },
  data() {
    return {
      isLoggedIn: true, //testing
      accountType: 'teacher' //testing
    }
  }
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
</style>
