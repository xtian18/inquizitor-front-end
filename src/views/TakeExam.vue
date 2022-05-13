<template>
  <div>
    <h1>Take Quiz</h1>
    <div class="form-container">
      <h3>Enter quiz code:</h3>
      <!-- 4AqLwb -->
      <form @submit.prevent="handleSubmit" class="mt-4">
        <div v-if="is_invalid" class="mb-2">
          <ErrorMessage>
            Quiz not found. Enter a valid code.
          </ErrorMessage>
        </div>
        <div v-if="is_due_date" class="mb-2">
          <ErrorMessage>
            The quiz is passed due date.
          </ErrorMessage>
        </div>
        <div v-if="is_empty" class="mb-2">
          <ErrorMessage>
            Empty quiz code. Enter a code.
          </ErrorMessage>
        </div>
        <input type="text" class="mb-3 text-center" v-model="code" @focus="reset">
        <button type="submit" class="btn btn-main">Enter</button>
      </form>
    </div>
  </div>
</template>

<script>
import ErrorMessage from '@/components/ErrorMessage.vue'

export default {
  components: { ErrorMessage },
  data() {
    return {
      code: '',
      quiz: '',
      is_due_date: false,
      is_empty: false,
      is_invalid: false
    }
  },
  methods: {
    getDate() {
      var due = new Date(this.quiz.due_date);
      var currentDate = new Date();

      if(currentDate >= due) {
        this.is_due_date = true
      } else {
        this.$router.push(`/take-quiz/${this.quiz.quiz_code}`);
      }
    },
    async handleSubmit() {
      if(this.code) {
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
          this.quiz = data;
          if(data.detail == 'Quiz not found') {
            this.is_invalid = true;
          } else {
            this.getDate();
          }
        } catch (e) {
          // console.log(e);
        }
      } else {
        this.is_empty = true;
      }

    },
    reset() {
      this.code = '';
      this.is_invalid = false;
      this.is_empty = false;
      this.is_due_date = false;
    }
  }
}
</script>

<style scoped>
.form-container {
  width: 50%;
  height: auto;
  text-align: center;
}
.form-container h3 {
  font-weight: 600;
}
</style>