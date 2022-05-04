<template>
  <div>
    <!-- create quiz modal -->
    <teleport to="#app">
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-container d-flex flex-column">
          <div class="modal-head text-center">
            <h1 class="me-auto">Create New Quiz</h1>
          </div>
          <div class="modal-body text-center">
            <form>
              <div class="form-group pb-3">
                <label for="name">Quiz Name:</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter quiz name"
                  v-model="name"
                  @keyup="enableButton"
                />
              </div>
              <div class="form-group pb-3">
                <label for="desc">Quiz Description:</label>
                <input
                  type="text"
                  id="desc"
                  placeholder="Enter quiz description"
                  v-model="desc"
                  @keyup="enableButton"
                />
              </div>
            </form>
          </div>
          <div class="modal-foot text-center">
            <button class="btn btn-main" @click="createQuiz" :disabled="!isButtonEnabled">Create new</button>
            <button class="btn btn-secondary me-3" @click="showModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </teleport>

    <h1>My Quizzes</h1>
    <!-- <button @click="test">test</button> -->
    <button class="btn btn-main" @click="showModal = true">Create new</button>
    <div class="exam-list">
      <div class="exam" v-for="quiz in quizzes" :key="quiz.id">
        <div class="me-auto">
          <h2>{{ quiz.name }}</h2>
          <p>{{ quiz.number_of_questions }} Questions</p>
        </div>
        <div class="exam-icon mb-auto">
          <router-link :to="`/my-exams/${quiz.id}`"
            ><font-awesome-icon icon="pen-to-square"
          /></router-link>
          <font-awesome-icon icon="trash-can" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      isButtonEnabled: false,
      name: "",
      desc: "",
      created_at: "2022-04-26T19:13:47.782661",
      due_date: "2022-04-26T20:08:17.431Z",
      quiz_code: "",
      number_of_questions: "",
      new_quiz_id: "",
      quizzes: [],
    };
  },
  methods: {
    loadQuizzes() {
      fetch("http://localhost:8000/quizzes/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credetials": "true",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => this.quizzes = data)
        .catch((err) => console.log(err));
    },
    createQuiz() {
      let formData = new FormData();
      formData.append("name", this.name);
      formData.append("desc", this.desc);
      // formData.append("number_of_questions", this.number_of_questions);
      // formData.append("created_at", this.created_at);
      formData.append("due_date", this.due_date);
      // formData.append("quiz_code", this.quiz_code);
      formData.append("teacher_id", this.user_id);

      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      fetch("http://localhost:8000/quizzes/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credetials": "true",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          console.log(data.id)
          this.$router.push(`/my-exams/${data.id}`)
          // this.$router.push({
          //   name: "CreateNew",
          //   params: { data: data.id },
          // });
        })
        .catch((err) => console.log(err));
    },
    enableButton() {
      if (this.name && this.desc) {
        this.isButtonEnabled = true;
      } else {
        this.isButtonEnabled = false;
      }
    }
  },
  computed: {
    user_id() {
      return this.$store.state.user.id;
    },
  },
  mounted() {
    this.loadQuizzes();
  },
};
</script>

<style scoped>
.btn {
  float: right;
}
.exam-icon {
  font-size: 2em;
}
.exam-icon svg {
  color: #93989c;
  margin-left: 15px;
}
.modal-container {
  width: 50%;
  height: auto;
}
.modal-head {
  width: 100%;
}
.modal-body {
  width: 100%;
}
.modal-foot {
  width: 100%;
  padding: 0 1rem;
}
</style>