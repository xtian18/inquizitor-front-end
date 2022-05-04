<template>
  <div>
    <h1>My Quizzes > {{ this.quiz.name }}</h1>
    <button class="btn btn-main ms-2">Save</button>
    <button class="btn btn-main" @click="handleAdd">Add Question</button>

    <div class="question-list">
      <div class="resultbox d-flex">
        <div class="form-group me-4 quiz-name">
          <label for="username">Quiz Name:</label>
          <input type="text" id="username" :value="this.quiz.name" />
        </div>
        <div class="form-group">
          <label for="password">Time Limit (min):</label>
          <input type="text" id="password" value="30" />
        </div>
      </div>
      <div class="question w-100" v-for="(question, index) in this.questions" :key="question.id">
        <div class="d-flex">
          <h4>Question {{ index + 1 }}</h4>
          <div class="exam-icon ms-auto">
            <button class="btn-icon" @click="handleUpdate(question.choices[0].question_id, index+1)">
              <font-awesome-icon icon="pen-to-square" />
            </button>
            <button class="btn-icon" @click="handleDelete(question.choices[0].question_id)">
              <font-awesome-icon icon="trash-can" />
            </button>
          </div>
        </div>
        <p class="text-wrap text-break">{{ question.content }}</p>
        <div class="ms-3">
          <div v-for="choice in questions[index].choices" :key="choice.id">
            <div class="choices text-wrap text-break" :class="{ answer: choice.is_correct }">
              {{ choice.content }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <DialogModal :showDialog="showDialog">
      <template v-slot:head>
        <h1>Delete Question</h1>
        <button type="button" class="btn-close" @click="showDialog=false">
        </button>
      </template>
      <template v-slot:body>
        <p>Are you sure you want to delete this question?</p>
      </template>
      <template v-slot:foot>
        <button class="btn btn-secondary me-3" @click="showDialog=false">Cancel</button>
        <button class="btn btn-danger" @click="deleteQuestion()">Delete</button>
      </template>
    </DialogModal>

    <!-- new question modal -->
    <teleport to="#app">
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-container">
          <div class="d-flex">
            <h1 class="me-auto">Question</h1>
            <button type="button" class="btn-close" @click="showModal = !showModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="form-group pb-2">
                <div>
                  <label for="question" class="mt-3">Question:</label>
                  <textarea name="question" id="question" cols="30" rows="30" v-model="new_question" :disabled="isQuestionDisabled"></textarea>
                  <!-- <button class="ms-auto" @click="addQuestion">save question</button>
                  <button class="ms-auto" @click="updateQuestion">update question</button> -->
                </div>

                <!-- answers -->
                <div>
                  <label class="mt-3">Answer: {{ selected_choice }}</label>
                  <!-- multiple choice -->
                  <div class="w-100" v-if="question_type === 'a'">
                    <div class="w-100 d-flex" v-for="(item, index) in multiple_choice" :key="index" selected>
                      <input type="radio" :id="index" name="choice" :value="index" v-model="selected_choice"/>
                      <label for="1" class="ms-2 w-100">
                        <input type="text" v-model="item.content"/>
                      </label>
                      <button class="round"  @click="removeChoice(index)" v-if="multiple_choice.length > 1">
                        <font-awesome-icon icon="trash-can" />
                      </button>
                    </div>
                    <div class="d-flex w-100">
                      <button class="round mx-auto" @click="addChoice" v-if="multiple_choice.length < 4">+</button>
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>
          <div class="bottom">
            <button class="btn btn-main ms-2" @click="submitQuestion">Save</button>
            <button class="btn btn-secondary" @click="showModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- update question modal -->
    <teleport to="#app">
      <div class="modal-overlay" v-if="showModalUpdate">
        <div class="modal-container">
          <div class="d-flex">
            <h1 class="me-auto">Question {{ question_num }}</h1>
            <button type="button" class="btn-close" @click="showModalUpdate = !showModalUpdate"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="form-group pb-2">
                <div>
                  <label for="question" class="mt-3">Question:</label>
                  <textarea name="question" id="question" cols="30" rows="30" v-model="new_question"></textarea>
                </div>

                <!-- answers -->
                <div>
                  <label class="mt-3">Answer:</label>
                  <!-- multiple choice -->
                  <div class="w-100" v-if="question_type === 'a'">
                    <div class="w-100 d-flex" v-for="(item, index) in multiple_choice" :key="index" selected>
                      <input type="radio" :id="index" name="choice" :value="index" v-model="selected_choice" :checked="item.is_correct" />
                      <label for="1" class="ms-2 w-100">
                        <input type="text" v-model="item.content"/>
                      </label>

                      <button class="round"  @click="removeChoice(index)" v-if="multiple_choice.length > 1">
                        <font-awesome-icon icon="trash-can" />
                      </button>
                    </div>
                    <div class="d-flex w-100">
                      <button class="round mx-auto" @click="addChoice" v-if="multiple_choice.length < 4">+</button>
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>
          <div class="bottom">
            <button class="btn btn-main ms-2" @click="submitUpdated">Save</button>
            <button class="btn btn-secondary" @click="showModalUpdate = false">Cancel</button>
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
      quiz: [],
      questions: [],
      questions_id: [],
      current_question_id: '',
      current_question: '',
      question_num: '',
      new_question: '',
      points: '1',
      new_choice: '',
      selected_choice: '',
      new_fill: '',
      showModal: false,
      showModalUpdate: false,
      showDialog: false,
      isQuestionDisabled: false,
      showChoice: false,
      question_type: 'a',
      multiple_choice: [
        {
          content: '',
        }
      ],
      fill_in_the_blank: [''],
      id: '',
      exam_name: '',
    };
  },
  computed: {
    order() {
      return this.quiz.questions.length;
    },
  },
  methods: {
    test() {
      console.log(this.multiple_choice);
    },
    loadQuiz() {
      fetch("http://localhost:8000/quizzes/" + this.id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credetials": "true",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          this.quiz = data;
          this.quiz.questions.forEach((question) =>
            this.questions_id.push(question.id)
          );
          this.loadQuestions();
        })
        .catch((err) => console.log(err));
    },
    loadQuestions() {
      this.questions_id.forEach((id) => {
        fetch("http://localhost:8000/quizzes/" + this.id + "/questions/" + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => this.questions.push(data))
          .catch((err) => console.log(err));
      });
    },
    handleAdd() {
      this.showModal = true;
      this.new_question = '';
      this.multiple_choice = [{
          content: '',
        }];
    },
    handleDelete(question_id) {
      this.showDialog = true;
      this.current_question_id = question_id;
    },
    async handleUpdate(question_id, question_num) {
      this.current_question_id = question_id;
      this.question_num = question_num;

      await fetch("http://localhost:8000/quizzes/" + this.id + "/questions/" + question_id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credetials": "true",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => this.current_question = data)
        .catch((err) => console.log(err));

      this.new_question = this.current_question.content;
      this.multiple_choice = this.current_question.choices;
      this.showModalUpdate = true;
    },
    deleteQuestion() {
      fetch("http://localhost:8000/quizzes/" + this.id + "/questions/" + this.current_question_id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credetials": "true",
        },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
      this.showDialog = false
      window.location.reload()
    },
    resolve() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
        }, 500);
      });
    },
    async submitQuestion() {
      this.addQuestion()
      const result = await this.resolve(); //to wait to finish adding questions
      this.postChoice();
      this.showModal = false;
      // window.location.reload()
    },
    submitUpdated() {
      this.updateQuestion();
      this.updateChoice();
      this.showModalUpdate = false;
    },
    addQuestion() {
      const formData = new FormData();

      formData.append("content", this.new_question);
      formData.append("points", this.points);
      formData.append("order", this.order);
      formData.append("quiz_id", this.id);

      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      fetch("http://localhost:8000/quizzes/" + this.id + "/questions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credetials": "true",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          this.showChoice = true;
          this.current_question_id = data.id;
          console.log(this.current_question_id);
          this.isQuestionDisabled = true;
        })
        .catch((err) => console.log(err));
    },
    updateQuestion() {
      const formData = new FormData();

      formData.append("content", this.new_question);
      formData.append("points", this.points);
      formData.append("order", this.order);
      formData.append("quiz_id", this.id);

      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      console.log(data)
      fetch("http://localhost:8000/quizzes/" + this.id + "/questions/" + this.current_question_id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credetials": "true",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => this.isQuestionDisabled = true)
        .catch((err) => console.log(err));
    },
    postChoice() {
      this.multiple_choice.forEach((choice, index) => {
        if(index == this.selected_choice) {
          choice.is_correct = true;
        } else {
          choice.is_correct = false;
        }       
      })
      
      this.multiple_choice.forEach(choice => {   
        const formData = new FormData();

        formData.append("content", choice.content)
        formData.append("is_correct", choice.is_correct)
        formData.append("question_id", this.current_question_id)

        const data = {};
        formData.forEach((value, key) => (data[key] = value));

        fetch("http://localhost:8000/quizzes/" + this.id + "/questions/" + this.current_question_id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data)
          })
          .catch((err) => console.log(err));
      })
    },
    addChoice() {
      this.multiple_choice.push({ value: "" });
    },
    updateChoice() {
      this.multiple_choice.forEach((choice, index) => {
        if(index == this.selected_choice) {
          choice.is_correct = true;
        } else {
          choice.is_correct = false;
        }       
      })
      
      this.multiple_choice.forEach(choice => {   
        const formData = new FormData();

        formData.append("content", choice.content)
        formData.append("is_correct", choice.is_correct)
        formData.append("question_id", this.current_question_id)

        const data = {};
        formData.forEach((value, key) => (data[key] = value));

        fetch("http://localhost:8000/quizzes/" + this.id + "/questions/" + this.current_question_id + "/choices/" + choice.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data)
          })
          .catch((err) => console.log(err));
      })
    },
    deleteChoice() {

    },
    removeChoice(index) {
      this.multiple_choice.splice(index, 1);
    },
    addAnswer() {
      this.fill_in_the_blank.push("");
    },
    resetModal() {
      this.question_type = "a";
      this.fill_in_the_blank = [];
      this.new_question = "";
    },
  },
  created() {
    this.id = this.$route.params.id;
    this.loadQuiz();
  },
};
</script>

<style scoped>
.resultbox {
  height: auto;
  background-color: white;
  border-radius: 10px;
  display: block;
  padding: 20px 30px;
  margin-bottom: 10px;
  margin-right: 10px;
}
#results {
  font-weight: 700;
  text-align: center;
}
.quiz-name {
  width: 70%;
}
.btn-main {
  float: right;
}

.exam-icon {
  font-size: 1.5em;
}

.exam-icon svg {
  color: #93989c;
  margin-left: 15px;
}

.question-list {
  width: 100%;
  margin-top: 70px;
  height: 72%;
  overflow: auto;
}

.question {
  background-color: white;
  margin-bottom: 10px;
  margin-right: 10px;
  padding: 20px 30px;
  height: auto;
  border-radius: 10px;
  transition: 0.3s;
}

.choices {
  width: 100%;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 5px 10px;
  margin: 5px 0px;
}

.answer {
  background-color: rgb(105, 210, 105);
  color: white;
}

.modal-container {
  display: flex;
  flex-direction: column;
  width: 70%;
  height: auto;
}

.modal-body {
  width: 100%;
  margin-bottom: 40px;
}

.bottom {
  position: absolute;
  bottom: 20px;
  right: 20px;
  margin-top: 20px;
}

input[type="text"] {
  margin-bottom: 10px;
  height: 40px;
}
input[type="radio"] {
  transform: scale(2);
  position: relative;
  top: 14px;
  left: -1px;
}
input[type="radio"]:after {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  top: -4px;
  left: -2px;
  position: relative;
  background-color: #d1d3d1;
  content: "";
  display: inline-block;
  visibility: visible;
  border: 2px solid white;
}
input[type="radio"]:checked:after {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  top: -4px;
  left: -2px;
  position: relative;
  background-color: #3d3657;
  content: "";
  display: inline-block;
  visibility: visible;
  border: 2px solid white;
}
.question-type input[type="radio"] {
  top: 2px;
}
.round {
  margin-left: 10px;
  background-color: #3d3657;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  text-align: center;
}
</style>