<template>
  <div>
    <h1>Take Exam</h1>
    <div class="form-container">
      <h3>Enter exam code:</h3>
      <form @submit.prevent="handleSubmit">
        <input type="text" class="mt-4 mb-3 text-center" v-model="code">
        <button type="submit" class="btn">Enter</button>
      </form>
    </div>
  </div>
</template>

<script>
import QuizTemplateVue from './QuizTemplate.vue'
export default {
  data() {
    return {
      code: '',
      quizzes: [
        {
          id: '1',
          quiz_name: 'Quiz 1',
          passcode: '1234abcd'
        },
        {
          id: '2',
          quiz_name: 'Quiz 2',
          passcode: '5678efgh'
        },
        {
          id: '3',
          quiz_name: 'Quiz 3',
          passcode: '2468qwer'
        },
      ]
    }
  },
  methods: {
    handleSubmit() {
      console.log(this.code)
      for(var i=0; i < this.quizzes.length; i++) {
        if(this.quizzes[i].passcode === this.code) {
          console.log("success")
          this.$router.replace('/take-exam/' + this.quizzes[i].id);
        } else {
          console.log("failed")
        }
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  width: 50%;
  height: 40%;
  text-align: center;
}
.form-container h3 {
  font-weight: 600;
}
</style>