<template>
  <div class="container" v-click-away="handleFocusOut" @click="handleFocus">

    <!-- instruction modal -->
    <teleport to="#app">
      <div class="modal-overlay" v-if="showInstruction">
        <div class="modal-container d-flex flex-column">
            <div class="modal-head text-center">
            <h1 class="me-auto">Instructions</h1>
            </div>
            <div class="modal-body text-center">
            <p>Read and answer each question carefully. Once you click next, you can no longer go back to the previous questions. Good Luck!</p>
            </div>
            <div class="modal-foot text-center">
                <button class="btn btn-main" @click="showInstruction=false">I understand</button>
            </div>
        </div>
      </div>
    </teleport>

    <div class="titlebox">
      <h1>{{ quiz.name }}</h1>
    </div>

    <div class="quiz-container">
      <div class="quizbox mt-3">
        <div class="bar">
          <div class="quiz-progress" :style="{ width: progress + '%' }"></div>
        </div>

        <div v-for="question in questions" :key="question.id" v-show="current_question.id == question.id">
          <div class="question">
            <p>Question {{ question_num }}/{{ quiz.number_of_questions }} </p>
            <div>
              <p class="text-wrap text-break">{{ question.content }}</p>
            </div>
          </div>
          <div class="answer-list" v-show="question.question_type === 'multiple-choice'">
            <div class="answers" v-for="(choice,index) in question.choices" :key="choice.id">
              <input type="radio" default="none" :name="question.id" :id="choice.id" :value="index" @click.stop="isEmpty" v-model="user_answer"/>
              <label :for="choice.id" class="text-wrap text-break">{{ choice.content }}</label>
            </div>
          </div>
          <div class="answer-list" v-show="question.question_type === 'fill-in-the-blank'">
            <div class="answers">
              <input type="text" v-model="user_answer" @paste="sendPaste">
            </div>
          </div>
        </div>

      </div>

      <div class="bottom">
        <input type="submit" v-show="current_question_id == last_question_id" class="btn btn-main" @click="handleSubmit" :disabled="!isAnswered"/>
        <button class="btn btn-main" v-show="current_question_id < last_question_id" @click="checkAnswer($event, currentIndex)" :disabled="!isAnswered">
          Next
        </button>
      </div>
      
    </div>

  </div>
</template>

<script>
import config from '../../config'

export default {
  data() {
    return {
      showInstruction: true,
      isAgree: false,
      progress: 0,
      user_answer: '',
      isAnswered: false,
      points: 0,
      //Quiz Data
      code: '',
      quiz: [],
      questions_id: [],
      questions: [],
      question_num: 1,
      current_question: '',
      current_question_id: 0,
      last_question_id: 0,
      attempt: null
    };
  },
  computed: {
    is_taking() {
      const url = this.$route.path
      return url.slice(0,11) === '/take-quiz/' && url.length < 18 ? true : false
    },
    user_id() {
      return this.$store.state.user.id;
    },
  },
  watch: {
    current_question_id() {
      localStorage.setItem('question_id', this.current_question_id)
    },
    user_answer() {
      this.isEmpty()
    },
    question_num() {
      this.progress = this.question_num / this.quiz.number_of_questions * 100
    }
  },
  methods: {
    handleFocusOut() {
      this.$store.commit('SET_QUIZ_STARTED', false);
    },
    handleFocus() {
      this.$store.commit('SET_QUIZ_STARTED', true);
    },
    async sendPaste() {
      if(this.is_taking) {
        let question_id = localStorage.question_id;
        // console.log('paste')
        const data = {'paste': 1};

        try {
          const response = await fetch(`${config.apiURL}/quizzes/${localStorage.quiz_id}/questions/${question_id}/actions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credetials": "true",
            },
            credentials: "include",
            body: JSON.stringify(data)
          });
          console.log(await response.json())
        } catch(e) {
          // console.log(e)
        }
      }
    },
    async loadQuiz() {
      this.quiz = [];
      this.questions_id = [];
      this.questions = [];
      this.$store.commit('SET_SHOW_LOADING_SCREEN', true);
      try {
        const response = await fetch(`${config.apiURL}/quizzes/${this.code}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credetials": "true",
            },
            credentials: "include",
          }
        );
        const loadQuiz = await response.json();
        this.quiz = loadQuiz;

        for (const question of this.quiz.questions) {
          this.questions_id.push(question.id);
        }
        const result = await this.loadQuestions();
        this.last_question_id = this.questions.slice(-1)[0].id;
        this.$store.commit('SET_SHOW_LOADING_SCREEN', false);
      } catch (e) {
        // console.log(e);
        this.$store.commit('SET_SHOW_LOADING_SCREEN', false);
      }
    },
    async loadQuestions() {
      try {
        for (const id of this.questions_id) {
          const response = await fetch(`${config.apiURL}/quizzes/${this.code}/questions/${id}`, {
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
        const attempt = await this.getQuizProgress()
        if(this.attempt.recent_question_id) {
          this.current_question_id = this.attempt.recent_question_id
        } else {
          this.current_question_id = this.questions[0].id;
        }

        this.setCurrentQuestion();
      } catch(e) {
        // console.log(e);
      }
    },
    async getQuizProgress() {
      try {
        const response = await fetch(`${config.apiURL}/quizzes/${this.code}/attempt`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credetials": "true",
            },
            credentials: "include",
          }
        );
        this.attempt = await response.json();
      } catch (e) {
        // console.log(e);
      }
    },
    setCurrentQuestion() {
      this.current_question = this.questions.filter(item => item.id == this.current_question_id)[0];
      this.question_num =  this.questions.indexOf(this.current_question) + 1
    },
    isEmpty() {
      if (this.user_answer || this.user_answer === 0) {
        this.isAnswered = true;
      } else {
        this.isAnswered = false;
      }
    },
    async updateAnswer() {
      const formData = new FormData();

      if(this.current_question.question_type === 'multiple-choice') {
        formData.append("content", this.current_question.choices[this.user_answer].content);
        formData.append("choice_id", this.current_question.choices[this.user_answer].id);
      } else {
        formData.append("content", this.user_answer);
      }
      formData.append("student_id", this.user_id);
      formData.append("question_id", this.current_question.id);

      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      try {
        const response = await fetch(`${config.apiURL}/quizzes/${this.quiz.id}/questions/${this.current_question_id}/answer`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        const check_answer = await response.json();
      } catch(e) {
        // console.log(e);
      }
    },
    async finishQuiz() {
      try {
        const response = await fetch(`${config.apiURL}/quizzes/${this.quiz.id}/finish`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
        });
        const finish = await response.json();
      } catch (e) {
        // console.log(e);
      }
    },
    async checkAnswer(e, name) {   
      const result = await this.updateAnswer();
      // this.progress = this.progress + 100 / this.quiz.number_of_questions;

      if(this.current_question.question_type === 'multiple-choice') {
        this.clearSelection(name);
      }
      this.isAnswered = false;
      this.user_answer = '';
      this.current_question_id++;
      this.question_num++;
      this.setCurrentQuestion();
    },
    async handleSubmit() {
      const result = await this.updateAnswer();
      // this.progress = this.progress + 100 / this.quiz.number_of_questions;
      const result2 = await this.finishQuiz();
      this.$store.commit('SET_QUIZ_STARTED', false);
      this.$router.replace({ path: `/take-quiz/${this.code}/result`})
    },
    clearSelection(name) {
      const radio_btn = document.querySelectorAll(
        "input[type='radio'][name='" + name + "']"
      );
      radio_btn.forEach((radio_btn) => {
        if (radio_btn.checked === true) {
          radio_btn.checked = false;
        }
      });
    },
  },
  async created() {
    this.code = this.$route.params.id;
    const result = await this.loadQuiz();
    localStorage.setItem('quiz_id', this.quiz.id)
  },
};
</script>

<style scoped>
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
}
.titlebox {
  width: 80%;
  margin: auto;
}
.quiz-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 80%;
}
.timer {
  display: flex;
  font-size: 1.2em;
  width: 100%;
  height: 10%;
  margin-bottom: 5px;
  text-align: right;
  justify-content: right;
}
.time {
  width: 40px;
}
.quizbox {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  margin: auto;
  padding: 5%;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}
.bar {
  height: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.quiz-progress {
  height: 10px;
  width: 20%;
  background-color: #3d3657;
  border-radius: 10px;
  transition: 0.5s;
}
.bottom {
  width: 100%;
  height: 10%;
  margin-top: 10px;
  text-align: right;
}
.question {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px 30px;
  min-height: 120px;
  border-radius: 10px;
  transition: 0.3s;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.2);
}
.question > p {
  text-align: center;
  color: #2d283e;
  font-size: 1.2em;
  font-weight: 700;
}
.answer-list {
  margin-top: 20px;
}
.answers {
  min-height: 10px;
  padding: 3px;
  margin: 2px 0px;
}
input[type="radio"] {
  display: none;
}
.answers label {
  width: 100%;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
}
.answers label:hover {
  background-color: #f5f5f5;
}
input[type="radio"]:checked + label {
  background-color: #d1d7e0;
}
</style> 