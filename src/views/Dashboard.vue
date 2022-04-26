<template>
  <div>
    <h1 class="text-center">Welcome, Jaehyun!</h1>

    <!-- if teacher -->
    <div class="card-wrapper d-flex" v-if="accountType === 'teacher'">
      <div class="card me-auto" style="width:400px" @click="this.$router.push('/my-exams')">
        <img class="card-img-top" src="@/assets/card1.png" alt="Card image">
        <div class="card-body">
          <h4 class="card-title text-center">My Quizzes</h4>
          <p class="card-text text-center">View and update the quizzes created, and create new ones</p>
        </div>
      </div>
      <div class="card" style="width:400px" @click="this.$router.push('/reports')">
        <img class="card-img-top" src="@/assets/card2.png" alt="Card image">
        <div class="card-body">
          <h4 class="card-title text-center">Reports</h4>
          <p class="card-text text-center">View the list of finished quizzes along with each reports.</p>
        </div>
      </div>
    </div>
    <!-- if student -->
    <div class="card-wrapper d-flex" v-else>
      <div class="card me-auto" style="width:400px" @click="this.$router.push('/take-exam')">
        <img class="card-img-top" src="@/assets/card1.png" alt="Card image">
        <div class="card-body">
          <h4 class="card-title text-center">Take Quiz</h4>
          <p class="card-text text-center">Start taking quiz now! All you need is a pass code from your teacher</p>
        </div>
      </div>
      <div class="card" style="width:400px"  @click="this.$router.push('/activities')">
        <img class="card-img-top" src="@/assets/card2.png" alt="Card image">
        <div class="card-body">
          <h4 class="card-title text-center">Activities</h4>
          <p class="card-text text-center">View your recent activities to review the results</p>
        </div>
      </div>
    </div>

  </div>
  
</template>

<script>
export default {
  data() {
    return {
      accountType: 'teacher',
    }
  }
}
</script>

<style scoped>
h4 {
  font-weight: 700;
}
.card-wrapper {
  width: 90% ;
  margin: auto;
  margin-top: 70px;
}
.card {
  height: auto;
  width: 40%;
  border-radius: 20px;
}
.card:hover {
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.card-img-top {
  margin: auto;
  width: 350px !important;
}
</style>