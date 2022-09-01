<template>
  <div>
    <!-- <button @click="test">test</button> -->
    <h1>My Quizzes</h1>

    <a class="help" @click="showHelp=true">Help <font-awesome-icon icon="circle-question" /></a>

    <!-- show if no quizzes -->
    <div v-if="showEmptyPage" class="empty-page text-center">
      <img class="" src="@/assets/empty-page.png" alt="">
      <h3>You haven't created any quizzes yet</h3>
      <h2 class="empty" @click="showModal = true">Create your first one now!</h2>
    </div>


    <button class="btn btn-main" @click="showModal = true" v-else>Create new</button>

    <!-- quiz list -->
    <div class="exam-list" v-if="!showEmptyPage">
      <div class="exam" v-for="quiz in quizzes" :key="quiz.id">
        <div class="me-auto">
          <h2>{{ quiz.name }}</h2>
          <p>{{ quiz.number_of_questions }} Questions</p>
        </div>
        <div class="exam-icon mb-auto">
          <router-link :to="`/my-quizzes/${quiz.id}`"
            ><font-awesome-icon icon="pen-to-square" class="action"
          /></router-link>
          <button class="btn-icon action" @click="handleDelete(quiz.id)">
            <font-awesome-icon icon="trash-can" />
          </button>
        </div>
      </div>
    </div>

    <!-- delete confirmation modal -->
    <DialogModal :showDialog="showDialog">
      <template v-slot:head>
        <h1>Delete Quiz</h1>
        <button type="button" class="btn-close action" @click="showDialog=false">
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

    <!-- help modal -->
    <HelpModal :showHelp="showHelp">
      <template v-slot:head>
        <h1>Need help?</h1>
        <button type="button" class="btn-close action" @click="showHelp=false,isOpen=0">
        </button>
      </template>
      <template v-slot:body>
        <div class="help-body">
          <div class="help-expand" @click="setOpen(1)">
            <!-- visible -->
            <div>
              <p class="help-question"><font-awesome-icon icon="circle-plus" /> How to create a quiz?</p>
            </div>
            <!-- hidden -->
            <div v-if="isOpen==1" class="mt-3">
              <ol>
                <li>If you haven't created any quizzes yet, click the <strong>"Create your first quiz now"</strong> below. If you already have existing quizzes, just click the <strong>"Create new"</strong> button at the upper right corner.</li><br>
                <li>A window will pop-up where you need to input the quiz name, subject and due date. The <strong>"Create new"</strong> button below the window will be available once all the necessary information have been filled out.</li><br>
                <li>After clicking the button, you will be taken to the quiz page where you can update quiz information or add, update and delete questions.</li>
              </ol>
            </div>
          </div>

          <div class="help-expand" @click="setOpen(2)">
            <!-- visible -->
            <div>
              <p class="help-question"><font-awesome-icon icon="pen-to-square" /> How to update a quiz?</p>
            </div>
            <!-- hidden -->
            <div v-if="isOpen==2" class="mt-3">
              <ol>
                <li>In each quiz listed, there will be two buttons on the right side of the box. Just click the <strong>
                  <font-awesome-icon icon="pen-to-square" /> button
                </strong> if you want to update or edit a particular quiz.</li><br>
                <li>After clicking the button, you will be taken to the quiz page where you can update quiz information or add, update and delete questions.</li>
              </ol>
            </div>
          </div>

          <div class="help-expand" @click="setOpen(3)">
            <!-- visible -->
            <div>
              <p class="help-question"><font-awesome-icon icon="trash-can" /> How to delete a quiz?</p>
            </div>
            <!-- hidden -->
            <div v-if="isOpen==3" class="mt-3">
              <ol>
                <li>In each quiz listed, there will be two buttons on the right side of the box. Just click the <strong>
                  <font-awesome-icon icon="trash-can" /> button
                </strong> if you want to delete a particular quiz.</li><br>
                <li>After clicking the button, a dialog box will pop-up asking for a confirmation before deleting the quiz.</li><br>
                <li>Click the <strong>"Delete"</strong> button if you are sure you want to delete the quiz.</li>
              </ol>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:foot>
        <button class="btn btn-main" @click="showHelp=false">OK</button>
      </template>
    </HelpModal>

    <!-- create quiz modal -->
    <teleport to="#app">
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-container d-flex flex-column">
          <div class="modal-head">
            <h1 class="me-auto text-center">Create New Quiz</h1>
            <button type="button" class="btn-close action" @click="showModal = !showModal"></button>
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
          <div class="modal-foot">
            <button class="btn btn-main" @click="createQuiz" :disabled="!isButtonEnabled">Create new</button>
            <button class="btn btn-secondary me-3" style="float: right;" @click="closeModal">Cancel</button>
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
      selected_quiz_id: '',
      isOpen: 0,
      showModal: false,
      showDialog: false,
      showHelp: false,
      showEmptyPage: false,
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
    setOpen(index) {
      this.isOpen = index;
    },
    setEmptyPage() {
      if(this.quizzes.length){
        this.showEmptyPage = false;
      } else {
        setTimeout(() => this.showEmptyPage = true, 100)
      }
    },
    async loadQuizzes() {
      try {
        const loadQuiz = await fetch(`${config.apiURL}/quizzes`, {
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
        const postQuiz = await fetch(`${config.apiURL}/quizzes`, {
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
        const response = await fetch(`${config.apiURL}/quizzes/${this.selected_quiz_id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
        });
        
        this.showDialog = false;
        await this.loadQuizzes();
        this.setEmptyPage();
      } catch(e) {
        console.log(e)
      }
    },
    closeModal() {
      this.isOpen = 0;
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
  async created() {
    const result = await this.loadQuizzes();
    this.setEmptyPage();
  },
};
</script>

<style scoped>
.btn-main {
  float: right;
}
.exam-icon {
  font-size: 2em;
  min-width: 90px;
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