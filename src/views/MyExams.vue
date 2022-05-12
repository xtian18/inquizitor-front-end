<template>
  <div>
    <h1>My Quizzes</h1>
    <button class="btn btn-main" @click="showModal = true">Create new</button>
    <div class="exam-list">
      <div class="exam" v-for="quiz in quizzes" :key="quiz.id">
        <div class="me-auto">
          <h2>{{ quiz.name }}</h2>
          <p>{{ quiz.number_of_questions }} Questions</p>
        </div>
        <div class="exam-icon mb-auto">
          <router-link :to="`/my-quizzes/${quiz.id}`"
            ><font-awesome-icon icon="pen-to-square"
          /></router-link>
          <button class="btn-icon" @click="handleDelete(quiz.id)">
            <font-awesome-icon icon="trash-can" />
          </button>
        </div>
      </div>
    </div>

    <DialogModal :showDialog="showDialog">
      <template v-slot:head>
        <h1>Delete Quiz</h1>
        <button type="button" class="btn-close" @click="showDialog=false">
        </button>
      </template>
      <template v-slot:body>
        <p>Are you sure you want to delete this quiz?</p>
      </template>
      <template v-slot:foot>
        <button class="btn btn-secondary me-3" @click="showDialog=false">Cancel</button>
        <button class="btn btn-danger" @click="deleteQuiz()">Delete</button>
      </template>
    </DialogModal>

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
                <input type="text" id="name" placeholder="Enter quiz name" v-model="name" @keyup="enableButton"/>
              </div>
              <div class="form-group pb-3">
                <label for="desc">Subject:</label>
                <input type="text" id="desc" placeholder="Enter subject" v-model="desc" @keyup="enableButton"/>
              </div>
              <div>
                <label for="due_date">Due Date:</label><br>
                <input type="datetime-local" id="due_date" name="due_date" v-model="due_date" @change="enableButton">
              </div>
            </form>
          </div>
          <div class="modal-foot text-center">
            <button class="btn btn-main" @click="createQuiz" :disabled="!isButtonEnabled">Create new</button>
            <button class="btn btn-secondary me-3" @click="closeModal">Cancel</button>
          </div>
        </div>
      </div>
    </teleport>

  </div>
</template>

<script>
import DialogModal from "@/components/DialogModal.vue";

export default {
  components: { DialogModal },
  data() {
    return {
      selected_quiz_id: '',
      showModal: false,
      showDialog: false,
      isButtonEnabled: false,
      name: "",
      desc: "",
      created_at: "2022-04-26T19:13:47.782661",
      due_date: "",
      quiz_code: "",
      number_of_questions: "",
      new_quiz_id: "",
      quizzes: [],
    };
  },
  methods: {
    test() {
      console.log('hello')
    },
    async loadQuizzes() {
      try {
        const loadQuiz = await fetch("http://localhost:8000/quizzes/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
        });
        this.quizzes = await loadQuiz.json();
      } catch (e) {
        console.log(e);
      }
    },
    async createQuiz() {
      let formData = new FormData();
      formData.append("name", this.name);
      formData.append("desc", this.desc);
      formData.append("due_date", this.due_date);
      formData.append("teacher_id", this.user_id);

      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      try {
        const postQuiz = await fetch("http://localhost:8000/quizzes/", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          body: JSON.stringify(data)
        });
        const newQuiz = await postQuiz.json();
        this.$router.push(`/my-quizzes/${newQuiz.id}`);
      } catch (e) {
        console.log(e);
      }
    },
    handleDelete(id) {
      this.selected_quiz_id = id;
      this.showDialog = true;
    },
    async deleteQuiz() {
      try {
        const response = await fetch("http://localhost:8000/quizzes/" + this.selected_quiz_id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
        });
        
        this.showDialog = false;
        await this.loadQuizzes();
      } catch(e) {
        console.log(e)
      }
    },
    closeModal() {
      this.showModal = false;
      this.name =  '';
      this.desc = '';
      this.due_date = '';
      this.isButtonEnabled = false;
    },
    enableButton() {
      if (this.name && this.desc && this.due_date) {
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
  text-align: left !important;
  width: 100%;
}
.modal-foot {
  width: 100%;
  padding: 0 1rem;
}
</style>