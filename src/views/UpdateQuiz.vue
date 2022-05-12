<template>
  <div>
    <!-- header -->
    <h1>My Quizzes > {{ this.name }}</h1>

    <!-- buttons at the top -->
    <!-- <button class="btn btn-main ms-2">Save</button> -->
    <button class="btn btn-main" @click="handleAdd">Add Question</button>

    <div class="question-list">
      <!-- quiz information -->
      <div class="resultbox d-flex">
        <div class="quiz-main me-3">
          <div class="form-group">
            <label for="username">Quiz Name:</label>
            <div class="d-flex">
              <input type="text" id="username" v-model="quiz.name" :disabled="!isNameEnabled"/>
              <button class="square" v-if="isNameEnabled" @click="quizNameToggle">
                <font-awesome-icon icon="thumbs-up" />
              </button>
              <button class="square" v-else @click="isNameEnabled = !isNameEnabled">
                <font-awesome-icon icon="pen-to-square" />
              </button>
            </div>
          </div>
          <div class="form-group">
            <label for="username">Quiz Description:</label>
            <div class="d-flex">
              <input type="text" id="username" v-model="quiz.desc" :disabled="!isDescEnabled"/>
              <button class="square" v-if="isDescEnabled" @click="quizDescToggle">
                <font-awesome-icon icon="thumbs-up" />
              </button>
              <button class="square" v-else @click="isDescEnabled = !isDescEnabled">
                <font-awesome-icon icon="pen-to-square" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <div class="form-group">
            <label for="username">Due Date:</label>
            <div class="d-flex">
              <input type="datetime-local" id="due_date" v-model="quiz.due_date" :disabled="!isDueDateEnabled">
              <button class="square" v-if="isDueDateEnabled" @click="quizDueDateToggle">
                <font-awesome-icon icon="thumbs-up" />
              </button>
              <button class="square" v-else @click="isDueDateEnabled = !isDueDateEnabled">
                <font-awesome-icon icon="pen-to-square" />
              </button>
            </div>
          </div>
          <div class="form-group">
            <label for="username">Quiz Code:</label>
            <input type="text" id="username" :value="quiz.quiz_code" disabled/>
          </div>
        </div>
      </div>

      <!-- questions -->
      <div class="question" v-for="(question, index) in this.questions" :key="question.id">
        <div class="d-flex">
          <div class="d-flex">
            <h4>Question {{ index + 1 }} </h4>
            <span class="points" v-if="question.points==1">({{ question.points }} point)</span>
            <span class="points" v-else>({{ question.points }} points)</span>
          </div>
          <div class="exam-icon ms-auto">
            <button class="btn-icon" @click="handleUpdate(question.id, index+1)">
              <font-awesome-icon icon="pen-to-square" />
            </button>
            <button class="btn-icon" @click="handleDelete(question.id)">
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

    <!-- delete dialog box -->
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
            <button type="button" class="btn-close" @click="closeAddModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="form-group pb-2">
                <!-- points -->
                <div>
                  <label for="question" class="mt-3">Points:</label><br>
                  <input type="number" min="1" v-model="points" @change="enableSave"/>
                </div>

                <!-- question -->
                <div>
                  <label for="question" class="mt-3">Question:</label>
                  <textarea name="question" id="question" cols="30" rows="30" v-model="new_question" @keyup="enableSave"></textarea>
                </div>

                <!-- answers -->
                <div>
                  <label class="mt-3">Answer:</label>
                  <!-- multiple choice -->
                  <div class="w-100" v-if="question_type === 'a'">
                    <div class="w-100 d-flex" v-for="(item, index) in multiple_choice" :key="index" selected>
                      <input type="radio" :id="index" name="choice" :value="index" v-model="selected_choice" @change="enableSave"/>
                      <label for="1" class="ms-2 w-100">
                        <input type="text" v-model="item.content" @keyup="enableSave"/>
                      </label>
                      <button class="round"  @click="removeChoiceInput(index)" v-if="multiple_choice.length > 1">
                        <font-awesome-icon icon="trash-can" />
                      </button>
                    </div>
                    <div class="d-flex w-100">
                      <button class="round mx-auto" @click="addChoiceInput" v-if="multiple_choice.length < 4">+</button>
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>
          <div class="bottom">
             <!-- :disabled="!isSaveEnabled" -->
            <button class="btn btn-main ms-2" @click="submitQuestion" :disabled="!isSaveEnabled">Save</button>
            <button class="btn btn-secondary" @click="closeAddModal">Cancel</button>
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
            <button type="button" class="btn-close" @click="cancelUpdate"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="form-group pb-2">
                <!-- points -->
                <div>
                  <label for="question" class="mt-3">Points:</label><br>
                  <input type="number" min="1" v-model="points" @change="enableSave"/>
                </div>

                <!-- questions -->
                <div>
                  <label for="question" class="mt-3">Question:</label>
                  <textarea name="question" id="question" cols="30" rows="30" v-model="new_question" @keyup="enableSave"></textarea>
                </div>

                <!-- answers -->
                <div>
                  <label class="mt-3">Answer:</label>
                  <!-- multiple choice -->
                  <div class="w-100" v-if="question_type === 'a'">
                    <div class="w-100 d-flex" v-for="(item, index) in multiple_choice" :key="index" selected>
                      <input type="radio" :id="index" name="choice" :value="index" v-model="selected_choice" :checked="item.is_correct"  @click="enableSave"/>
                      <label for="1" class="ms-2 w-100">
                        <input type="text" v-model="item.content" @keyup="enableSave"/>
                      </label>

                      <button class="round"  @click="removeChoiceInput(index)" v-if="multiple_choice.length > 1">
                        <font-awesome-icon icon="trash-can" />
                      </button>
                    </div>
                    <div class="d-flex w-100">
                      <button class="round mx-auto" @click="addChoiceInput" v-if="multiple_choice.length < 4">+</button>
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </div>
          <div class="bottom">
             <!-- :disabled="!isSaveEnabled" -->
            <button class="btn btn-main ms-2" @click="submitUpdate">Save</button>
            <button class="btn btn-secondary" @click="cancelUpdate">Cancel</button>
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
      //current quiz information
      id: '',
      quiz: [],
      questions: [],
      questions_id: [],
      name: '',
      number_of_questions: '',

      //selected question information
      current_question_id: '',
      current_question: '',
      question_num: '',

      //question moodal information
      question_type: 'a',
      new_question: '',
      points: '1',
      new_choice: '',
      selected_choice: '',
      temp_selected: '',
      multiple_choice: [
        {
          content: '',
        }
      ],
      temp_multiple_choice: [
        {
          content: '',
        }
      ],

      //modal and button values
      showModal: false,
      showModalUpdate: false,
      showDialog: false,
      isSaveEnabled: false,
      isNameEnabled: false,
      isDescEnabled: false,
      isDueDateEnabled: false,
    };
  },
  computed: {
    user_id() {
      return this.$store.state.user.id;
    },
    // name() {
    //   return this.quiz.name;
    // },
    desc() {
      return this.quiz.desc;
    },
    // created_at() {
    //   return this.quiz.created_at;
    // },
    due_date() {
      return this.quiz.due_date;
    },
    // quiz_code() {
    //   return this.quiz.quiz_code;
    // },
    order() {
      return this.quiz.questions.length;
    }
  },
  methods: {
    async loadQuiz() {
      this.quiz = [];
      this.questions_id = [];
      this.questions = [];

      try {
        const response = await fetch("http://localhost:8000/quizzes/" + this.id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
        });
        const loadQuiz = await response.json();
        this.quiz = loadQuiz;

        for (const question of this.quiz.questions) {
          await this.questions_id.push(question.id)
        }
        this.loadQuestions();

      } catch(e) {
        console.log(e)
      }
    },
    async loadQuestions() {
      try {
        for (const id of this.questions_id) {
          const response = await fetch("http://localhost:8000/quizzes/" + this.id + "/questions/" + id, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credetials": "true",
            },
            credentials: "include"
          });
          const loadQuestions = await response.json();
          this.questions.push(loadQuestions);
        }
        const result = await this.updateQuiz();
        console.log(this.quiz)
      } catch(e) {
        console.log(e);
      }
    },
    async updateQuiz() {
      this.number_of_questions = this.order;

      const formData = new FormData();

      formData.append("name", this.quiz.name);
      formData.append("desc", this.quiz.desc);
      formData.append("number_of_questions", this.number_of_questions);
      formData.append("created_at", this.quiz.created_at);
      formData.append("due_date", this.quiz.due_date);
      formData.append("quiz_code", this.quiz.quiz_code);
      formData.append("teacher_id", this.user_id);

      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      try {
        const response = await fetch("http://localhost:8000/quizzes/" + this.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        const updated = await response.json();
      } catch(e) {
        console.log(e);
      }
    },
    quizNameToggle() {
      this.isNameEnabled = !this.isNameEnabled;
      this.name = this.quiz.name;
      this.updateQuiz();
    },
    quizDescToggle() {
      this.isDescEnabled = !this.isDescEnabled;
      this.updateQuiz();
    },
    quizDueDateToggle() {
      this.isDueDateEnabled = !this.isDueDateEnabled;
      this.updateQuiz();
    },
    resetValues() {
      this.isSaveEnabled = false;
      this.points = '1';
      this.new_question = '';
      this.new_choice = '';
      this.selected_choice = '';
      this.temp_selected = '';
      this.multiple_choice = [
        {
          content: '',
        }
      ];
      this.temp_multiple_choice = [
        {
          content: '',
        }
      ]
    },
    closeAddModal() {
      this.showModal = false;
      this.resetValues();
    },
    async cancelUpdate() {
      const result = await this.addChoice(this.temp_multiple_choice, this.temp_selected);
      this.showModalUpdate = false;
      this.resetValues();
      const result2 = await this.loadQuiz();
    },
    enableSave() {
      if(this.selected_choice === '') {
        this.isSaveEnabled = false;
      } else if (this.new_question && this.multiple_choice && this.points) {
        this.isSaveEnabled = true;
      } else {
        this.isSaveEnabled = false;
      }
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
    handleUpdate(question_id, question_num) {
      this.temp_multiple_choice = [];
      this.temp_selected = '',
      this.current_question_id = question_id;
      this.question_num = question_num;

      this.current_question = this.questions.filter(item => item.id == question_id)[0];
      this.points = this.current_question.points;
      this.new_question = this.current_question.content;
      this.multiple_choice = JSON.parse(JSON.stringify(this.current_question.choices));

      this.showModalUpdate = true;

      this.temp_multiple_choice = JSON.parse(JSON.stringify(this.multiple_choice));
      this.temp_selected = this.selected_choice;

      this.deleteChoice();
    },
    async deleteQuestion() {
      try {
        const response = await fetch("http://localhost:8000/quizzes/" + this.id + "/questions/" + this.current_question_id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
        });
        this.showDialog = false;
        await this.loadQuiz();
      } catch(e) {
        console.log(e)
      }
    },
    async submitQuestion() {
      const result = await this.addQuestion();
      const result2 = await this.addChoice(this.multiple_choice, this.selected_choice);
      this.closeAddModal();
      this.loadQuiz();
    },
    async submitUpdate() {
      const result = await this.updateQuestion();
      const result2 = await this.addChoice(this.multiple_choice, this.selected_choice);
      this.showModalUpdate = false;
      this.resetValues();
      this.loadQuiz();
    },
    async addQuestion() {
      const formData = new FormData();

      formData.append("content", this.new_question);
      formData.append("points", this.points);
      formData.append("order", this.order);
      formData.append("quiz_id", this.id);

      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      try{
        const response = await fetch("http://localhost:8000/quizzes/" + this.id + "/questions/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        const addQuestion = await response.json();
        this.current_question_id = addQuestion.id;
        console.log(addQuestion)
      } catch(e) {
        console.log(e)
      }
    },
    async updateQuestion() {
      const formData = new FormData();

      formData.append("content", this.new_question);
      formData.append("points", this.points);
      formData.append("order", this.order);
      formData.append("quiz_id", this.id);

      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      try {
        const response = await fetch("http://localhost:8000/quizzes/" + this.id + "/questions/" + this.current_question_id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
      } catch(e) {
        console.log(e);
      }
    },
    async addChoice(choices,answer) {
      try {
        for (let index=0; index<choices.length; index++) {
          if(index == answer) {
            choices.is_correct = true;
          } else {
            choices.is_correct = false;
          }   
        
        const formData = new FormData();
       
        formData.append("content", choices[index].content)
        formData.append("is_correct", choices.is_correct)
        formData.append("question_id", this.current_question_id)

        const data = {};
        formData.forEach((value, key) => (data[key] = value));


        const response = await fetch("http://localhost:8000/quizzes/" + this.id + "/questions/" + this.current_question_id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        }
      } catch(e) {
        console.log(e);
      }
    },
    addChoiceInput() {
      this.multiple_choice.push({ value: "" });
    },
    async deleteChoice() {
      try {
        console.log()
        const choice_array = this.questions[this.question_num-1].choices;

        for (const choice of choice_array) {
        const response = await fetch("http://localhost:8000/quizzes/" + this.id + "/questions/" + this.current_question_id + "/choices/" + choice.id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include"
        });
        }
      } catch(e) {
        console.log(e);
      }
    },
    removeChoiceInput(index) {
      this.multiple_choice.splice(index, 1);
    },
    addAnswer() {
      this.fill_in_the_blank.push("");
    }
  },
  async created() {
    this.id = this.$route.params.id;
    const result = await this.loadQuiz();
    this.name = this.quiz.name;
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
.quiz-main {
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

.points {
  font-size: 16px;
  font-style: italic;
  color: gray;
  margin: 3px 0px 0px 3px;

}

.question {
  background-color: white;
  margin-top: 10px;
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
  background-color: #272A3F;
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
  background-color: #272A3F;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  text-align: center;
}
.square {
  margin-left: 3px;
  background-color: #272A3F;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  text-align: center;
}
</style>