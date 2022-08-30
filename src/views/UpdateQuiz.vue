<template>
  <div>
    <!-- header -->
    <h1>My Quizzes > {{ this.name }}</h1>

    <a class="help" @click="showHelp=true">Help <font-awesome-icon icon="circle-question" /></a>

    <button class="btn btn-main" @click="handleAdd">Add Question</button>

    <div class="question-list">
      <!-- quiz information -->
      <div class="resultbox d-flex">
        <div class="me-3 w-50">
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
            <label for="username">Subject</label>
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
        <div class="w-50">
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
            <button class="btn-icon action" @click="handleUpdate(question.id, index+1)">
              <font-awesome-icon icon="pen-to-square" />
            </button>
            <button class="btn-icon action" @click="handleDelete(question.id)">
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
        <button type="button" class="btn-close action" @click="showDialog=false">
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

    <HelpModal :showHelp="showHelp">
      <template v-slot:head>
        <h1>Need Help?</h1>
        <button type="button" class="btn-close action" @click="showHelp=false,isOpen=0">
        </button>
      </template>
      <template v-slot:body>
        <div class="help-body">
          <div class="help-expand" @click="setOpen(1)">
            <!-- visible -->
            <div>
              <p class="help-question"><font-awesome-icon icon="pen-to-square" /> How to update quiz information?</p>
            </div>
            <!-- hidden -->
            <div v-if="isOpen==1" class="mt-3">
              <ol>
                <li>At the upper part of the page, you will see a box with the quiz information including its name, subject, due date and code.</li><br>
                <li>You can update the quiz name, subject or due date by clicking the <strong><font-awesome-icon icon="pen-to-square" /> button</strong> beside the text boxes.</li><br>
                <li>After clicking the button, the corresponding text box will be available where you can change the information written.</li><br>
                <li>Once you finish changing the information, you can click the <strong><font-awesome-icon icon="thumbs-up" /> button</strong> to save the changes.</li>
              </ol>
            </div>
          </div>

          <div class="help-expand" @click="setOpen(2)">
            <!-- visible -->
            <div>
              <p class="help-question"><font-awesome-icon icon="circle-plus" /> How to add questions?</p>
            </div>
            <!-- hidden -->
            <div v-if="isOpen==2" class="mt-3">
              <ol>
                <li>If you want to add questions, click the <strong>"Add Question"</strong> button at the upper right corner.</li><br>
                <li>After clicking the button, a window will pop-up where you can enter the question information.</li><br>
                <li>The first text box is where you need the put the equivalent points of the question. The second text box is where you need to put the question itself. Below them is where you need to put the choices and the correct answer.</li><br>
                <li>If you need more choices, click the <strong><font-awesome-icon icon="circle-plus" /> button</strong> below to add up to four choices. To delete a choice, click <strong><font-awesome-icon icon="trash-can" /> button</strong> on the right side of the choice you want to remove. To select the correct answer, click the <strong>circular button</strong> on the left side of the corresponding choice.</li><br>
                <li>Once you completed all the necessary information, the <strong>"Save"</strong> button will be available so that you can finally add the question to the quiz.</li>
              </ol>
            </div>
          </div>

          <div class="help-expand" @click="setOpen(3)">
            <!-- visible -->
            <div>
              <p class="help-question"><font-awesome-icon icon="pen-to-square" /> How to update a question?</p>
            </div>
            <!-- hidden -->
            <div v-if="isOpen==3" class="mt-3">
              <ol>
                <li>In each question, there will be two buttons on the upper right corner of the box. Just click the <strong><font-awesome-icon icon="pen-to-square" /> button</strong> if you want to update or edit a particular question.</li><br>
                <li>After clicking the button, a window will pop-up (similar when adding questions) containing the question information. Here you will be able to the edit points, question, choices and correct answer. Just change the particular question information in the corresponding text boxes you want to update.</li><br>
                <li>Once you are finished, click the <strong>"Save"</strong> button to save the changes.</li>

              </ol>
            </div>
          </div>

          <div class="help-expand" @click="setOpen(4)">
            <!-- visible -->
            <div>
              <p class="help-question"><font-awesome-icon icon="trash-can" /> How to delete a question?</p>
            </div>
            <!-- hidden -->
            <div v-if="isOpen==4" class="mt-3">
              <ol>
                <li>In each question, there will be two buttons on the upper right corner of the box. Just click the <strong><font-awesome-icon icon="trash-can" /> button</strong> if you want to delete a particular question.</li><br>
                <li>After clicking the button, a dialog box will pop-up asking for a confirmation before deleting the question.</li><br>
                <li>Click the <strong>"Delete"</strong> button if you are sure you want to delete the question.</li>
              </ol>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:foot>
        <button class="btn btn-main" @click="showHelp=false">OK</button>
      </template>
    </HelpModal>

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
                <div class="d-flex align-items-baseline">
                  <!-- question type -->
                  <div>
                    <label>Question Type:</label>
                    <div class="question-type mt-1 d-flex flex-column flex-lg-row">
                      <div>
                        <input type="radio" id="multiple-choice" name="question_type" value="multiple-choice" v-model="question_type"  @change="enableSave">
                        <label for="multiple-choice" class="ms-2 me-4">Multiple Choice</label>
                      </div>
                      <div>
                        <input type="radio" id="fill-in-the-blank" name="question_type" value="fill-in-the-blank" v-model="question_type" @change="enableSave">
                        <label for="fill-in-the-blank" class="ms-2 mt-1">Fill in the Blank</label>
                      </div>
                    </div>
                  </div>

                  <!-- points -->
                  <div class="w-auto ms-auto">
                    <label for="question" class="">Points:</label><br>
                    <input type="number" min="1" v-model="points" @change="enableSave"/>
                  </div>
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
                  <div class="w-100" v-if="question_type === 'multiple-choice'">
                    <div class="w-100 d-flex" v-for="(item, index) in choices" :key="index" selected>
                      <input type="radio" :id="index" name="choice" :value="index" v-model="selected_choice" @change="enableSave"/>
                      <label for="1" class="ms-2 w-100">
                        <input type="text" v-model="item.content" @keyup="enableSave"/>
                      </label>
                      <button class="round"  @click="removeChoiceInput(index)" v-if="choices.length > 1">
                        <font-awesome-icon icon="trash-can" />
                      </button>
                    </div>
                    <div class="d-flex w-100">
                      <button class="round mx-auto" @click="addChoiceInput" v-if="choices.length < 4">+</button>
                    </div>
                  </div>
                  <!-- fill-in-the-blank -->
                  <div v-if="question_type === 'fill-in-the-blank'">
                    <div class="w-100 d-flex" v-for="(item, index) in choices" :key="index">
                      <input class="radio" type="text" v-model="item.content">
                      <button class="round" @click="removeChoiceInput(index)" v-if="choices.length > 1">
                        <font-awesome-icon icon="trash-can" />
                      </button>
                    </div>
                    <div class="d-flex w-100"><button class="round mx-auto" @click="addChoiceInput" v-if="choices.length < 4">+</button></div>
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
                  <label for="question" class="">Points:</label><br>
                  <input type="number" min="1" v-model="points" @change="enableSave"/>
                </div>

                <!-- questions -->
                <div class="mt-3">
                  <label for="question" class="mt-3">Question:</label>
                  <textarea name="question" id="question" cols="30" rows="30" v-model="new_question" @keyup="enableSave"></textarea>
                </div>

                <!-- answers -->
                <div>
                  <label class="mt-3">Answer:</label>
                  <!-- multiple choice -->
                  <div class="w-100" v-if="question_type === 'multiple-choice'">
                    <div class="w-100 d-flex" v-for="(item, index) in choices" :key="index" selected>
                      <input type="radio" :id="index" name="choice" :value="index" v-model="selected_choice" :checked="item.is_correct"  @click="enableSave"/>
                      <label for="1" class="ms-2 w-100">
                        <input type="text" v-model="item.content" @keyup="enableSave"/>
                      </label>

                      <button class="round"  @click="removeChoiceInput(index)" v-if="choices.length > 1">
                        <font-awesome-icon icon="trash-can" />
                      </button>
                    </div>
                    <div class="d-flex w-100">
                      <button class="round mx-auto" @click="addChoiceInput" v-if="choices.length < 4">+</button>
                    </div>
                  </div>
                  <!-- fill-in-the-blank -->
                  <div v-if="question_type === 'fill-in-the-blank'">
                    <div class="w-100 d-flex" v-for="(item, index) in choices" :key="index">
                      <input class="radio" type="text" v-model="item.content">
                      <button class="round" @click="removeChoiceInput(index)" v-if="choices.length > 1">
                        <font-awesome-icon icon="trash-can" />
                      </button>
                    </div>
                    <div class="d-flex w-100"><button class="round mx-auto" @click="addChoiceInput" v-if="choices.length < 4">+</button></div>
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
import config from '../../config'
import DialogModal from "@/components/DialogModal.vue"
import HelpModal from "@/components/HelpModal.vue"

export default {
  components: { DialogModal, HelpModal },
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
      question_type: 'multiple-choice',
      new_question: '',
      points: '1',
      new_choice: '',
      selected_choice: '',
      temp_selected: '',
      choices: [
        {
          content: '',
        }
      ],
      temp_choices: [
        {
          content: '',
        }
      ],

      //modal and button values
      showModal: false,
      showModalUpdate: false,
      showDialog: false,
      showHelp: false,
      isOpen: 0,
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
    desc() {
      return this.quiz.desc;
    },
    due_date() {
      return this.quiz.due_date;
    },
    order() {
      return this.quiz.questions.length;
    }
  },
  methods: {
    setOpen(index) {
      this.isOpen = index;
    },
    async loadQuiz() {
      this.quiz = [];
      this.questions_id = [];
      this.questions = [];

      try {
        const response = await fetch(`${config.apiURL}/quizzes/${this.id}`, {
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
        // console.log(e)
      }
    },
    async loadQuestions() {
      try {
        for (const id of this.questions_id) {
          const response = await fetch(`${config.apiURL}/quizzes/${this.id}/questions/${id}`, {
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
      } catch(e) {
        // console.log(e);
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
        const response = await fetch(`${config.apiURL}/quizzes/${this.id}`, {
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
        // console.log(e);
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
      this.question_type = 'multiple-choice'
      this.points = '1';
      this.new_question = '';
      this.new_choice = '';
      this.selected_choice = '';
      this.temp_selected = '';
      this.choices = [
        {
          content: '',
        }
      ];
      this.temp_choices = [
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
      if(this.question_type === 'multiple-choice') {
        const result = await this.addChoice(this.temp_choices, this.temp_selected);
      } else {
        const result = await this.addChoice(this.temp_choices);
      }
      
      this.showModalUpdate = false;
      this.resetValues();
      const result2 = await this.loadQuiz();
    },
    enableSave() {
      if(this.question_type === 'multiple-choice') {
        if(this.selected_choice === '') {
          this.isSaveEnabled = false;
        } else if (this.new_question && this.choices && this.points) {
          this.isSaveEnabled = true;
        } else {
          this.isSaveEnabled = false;
        }
      } else {
        if (this.new_question && this.choices && this.points) {
          this.isSaveEnabled = true;
        } else {
          this.isSaveEnabled = false;
        }
      }

    },
    handleAdd() {
      this.showModal = true;
      this.new_question = '';
      this.choices = [{
        content: '',
      }];
    },
    handleDelete(question_id) {
      this.showDialog = true;
      this.current_question_id = question_id;
    },
    handleUpdate(question_id, question_num) {
      this.temp_choices = [];
      this.temp_selected = '',
      this.current_question_id = question_id;
      this.question_num = question_num;

      this.current_question = this.questions.filter(item => item.id == question_id)[0];
      this.question_type = this.current_question.question_type;
      this.points = this.current_question.points;
      this.new_question = this.current_question.content;
      this.choices = JSON.parse(JSON.stringify(this.current_question.choices));
      this.temp_choices = JSON.parse(JSON.stringify(this.choices));

      if(this.question_type === 'multiple-choice') {
        this.temp_selected = this.selected_choice;
      }
    
      this.showModalUpdate = true;
      this.deleteChoice();
    },
    async deleteQuestion() {
      try {
        const response = await fetch(`${config.apiURL}/quizzes/${this.id}/questions/${this.current_question_id}`, {
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
        // console.log(e)
      }
    },
    async submitQuestion() {
      const result = await this.addQuestion();
      if(this.question_type === 'multiple-choice') {
        const result2 = await this.addChoice(this.choices, this.selected_choice);
      } else {
        const result2 = await this.addChoice(this.choices);
      }
      this.closeAddModal();
      this.loadQuiz();
    },
    async submitUpdate() {
      const result = await this.updateQuestion();
      if(this.question_type === 'multiple-choice') {
        const result2 = await this.addChoice(this.choices, this.selected_choice);
      } else {
        const result2 = await this.addChoice(this.choices);
      }
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
      formData.append("question_type", this.question_type);

      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      try{
        const response = await fetch(`${config.apiURL}/quizzes/${this.id}/questions`, {
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
      } catch(e) {
        // console.log(e)
      }
    },
    async updateQuestion() {
      const formData = new FormData();

      formData.append("content", this.new_question);
      formData.append("points", this.points);
      formData.append("order", this.order);
      formData.append("quiz_id", this.id);
      formData.append("question_type", this.question_type);

      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      try {
        const response = await fetch(`${config.apiURL}/quizzes/${this.id}/questions/${this.current_question_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
      } catch(e) {
        // console.log(e);
      }
    },
    async addChoice(choices,answer='all') {
      try {
        for (let index=0; index<choices.length; index++) {
          if (answer === 'all') {
            choices.is_correct = true;
          } else if(index == answer) {
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


        const response = await fetch(`${config.apiURL}/quizzes/${this.id}/questions/${this.current_question_id}`, {
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
        // console.log(e);
      }
    },
    addChoiceInput() {
      this.choices.push({ value: "" });
    },
    async deleteChoice() {
      try {
        const choice_array = this.questions[this.question_num-1].choices;

        for (const choice of choice_array) {
        const response = await fetch(`${config.apiURL}/quizzes/${this.id}/questions/${this.current_question_id}/choices/${choice.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include"
        });
        }
      } catch(e) {
        // console.log(e);
      }
    },
    removeChoiceInput(index) {
      this.choices.splice(index, 1);
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
  visibility: hidden;
}
input[type="radio"]:after {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  top: 6px;
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
  top: 6px;
  left: -2px;
  position: relative;
  background-color: #272A3F;
  content: "";
  display: inline-block;
  visibility: visible;
  border: 2px solid white;
}
.question-type input[type="radio"] {
  top: -20px;
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