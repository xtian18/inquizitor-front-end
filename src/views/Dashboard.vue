<template>
  <div>
    <h1 class="text-center">Welcome {{user.full_name}}!</h1>

    <!-- if teacher -->
    <div class="card-wrapper d-flex flex-column flex-xl-row justify-content-between" v-if="user.is_teacher">
      <div class="card d-flex flex-row flex-xl-column" @click="this.$router.push('/my-quizzes')">
        <img class="card-img-top" src="@/assets/my-quizzes.png" alt="Card image">
        <div class="card-body">
          <h4 class="card-title text-center">My Quizzes</h4>
          <p class="card-text text-center">View and update the quizzes you have created, and also create new ones.</p>
        </div>
      </div>
      <div class="card d-flex flex-row flex-xl-column" @click="this.$router.push('/reports')">
        <img class="card-img-top" src="@/assets/reports.png" alt="Card image">
        <div class="card-body">
          <h4 class="card-title text-center">Reports</h4>
          <p class="card-text text-center">View the list of quizzes you have along with each reports including students' scores and avearge score.</p>
        </div>
      </div>
    </div>
    <!-- if student -->
    <div class="card-wrapper d-flex flex-column flex-xl-row justify-content-between" v-if="user.is_student">
      <div class="card d-flex flex-row flex-xl-column" @click="this.$router.push('/take-quiz')">
        <img class="card-img-top" src="@/assets/take-quiz.png" alt="Card image">
        <div class="card-body">
          <h4 class="card-title text-center">Take Quiz</h4>
          <p class="card-text text-center">Start taking quiz now! All you need is a pass code from your teacher to enter a quiz.</p>
        </div>
      </div>
      <div class="card d-flex flex-row flex-xl-column" @click="this.$router.push('/activities')">
        <img class="card-img-top" src="@/assets/activities.png" alt="Card image">
        <div class="card-body">
          <h4 class="card-title text-center">Activities</h4>
          <p class="card-text text-center">View your activities to see the quizzes you have taken and their answer keys to review yourself.</p>
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
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
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
  margin-left: 20px;
  max-width: 400px;
  width: 50%;
  border-radius: 20px;
}
.card:hover {
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.card-img-top {
  margin: auto;
  width: 80% !important;
}

@media only screen and (max-width: 1200px) {
  .card-wrapper {
    width: 90% ;
    margin-top: 30px;
  }
  .card {
    margin-left: 0px;
    width: auto;
    max-width: none;
    margin-bottom: 20px;
  }
  .card-img-top {
    width: 40% !important;
  }
}

@media only screen and (max-width: 768px) {
  .card-wrapper {
    margin-top: 20px;
  }
  .card {
    max-height: 250px;
  }
}

@media only screen and (max-width: 576px) {
  .card-wrapper {
    margin-top: 70px;
  }
  .card {
    max-height: 400px;
  }
}
</style>