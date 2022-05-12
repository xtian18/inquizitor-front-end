<template>
  <div>
    <h1>Take Quiz</h1>
    <div class="form-container">
      <h3>Enter quiz code:</h3>
      <!-- 4AqLwb -->
      <form @submit.prevent="handleSubmit">
        <input type="text" class="mt-4 mb-3 text-center" v-model="code">
        <button type="submit" class="btn btn-main">Enter</button>
      </form>
    </div>
  </div>
</template>

<script>

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
    async handleSubmit() {
      try {
        const response = await fetch("http://localhost:8000/quizzes/" + this.code, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
        });
        const data = await response.json();
        this.$router.push(`/take-quiz/${data.quiz_code}`);
      } catch (e) {
        // console.log(e);
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