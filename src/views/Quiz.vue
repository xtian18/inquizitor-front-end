<template>
  <div class="container">
    <!-- header -->
    <div class="titlebox">
      <h1>{{ quiz.name }}</h1>
    </div>

    <!-- <button @click="test">test</button> -->
    <!-- {{current_question}} -->

    <!-- quiz -->
    <div class="quiz-container">
      <div class="quizbox">

        <div class="bar">
          <div class="quiz-progress" :style="{ width: progress + '%' }"></div>
        </div>

        <div class="question">
          <p>Question {{ current_question.order + 1 }}/{{ quiz.number_of_questions }}</p>
          <div>
            <p>{{ current_question.content }}</p>
          </div>
        </div>

        <div class="answer-list">
          <div class="answers" v-for="(choice, index) in current_question.choices" :key="choice.id">
              <input type="radio" default="none" :id="choice.id" :name="current_question_id" :value="index" v-model="user_answer" @click="answerQuestion">
              <label :for="choice.id">{{choice.content}}</label>
          </div>
        </div>

      </div>

      <div class="bottom">
        <button class="btn btn-main" v-if="current_question_id == quiz.number_of_questions-1">Submit</button>
        <button class="btn btn-main" v-else :disabled="!isAnswered" @click="handleNext($event, current_question_id)">Next</button>
      </div>
      
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      //quiz information
      code: "",
      quiz: [],
      questions_id: [],
      questions: [],
      current_question_id: 0,
      current_question: '',
      //others
      user_answer: '',
      progress: 0,
      isAnswered: false
    };
  },
  computed: {
    user_id() {
      return this.$store.state.user.id;
    },
  },
  methods: {
    async loadQuiz() {
      this.quiz = [];
      this.questions_id = [];
      this.questions = [];

      try {
        const response = await fetch("http://localhost:8000/quizzes/" + this.code,{
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
        this.loadQuestions();
      } catch (e) {
        console.log(e);
      }
    },
    async loadQuestions() {
      try {
        for (const id of this.questions_id) {
          const response = await fetch(
            "http://localhost:8000/quizzes/" + this.code + "/questions/" + id,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credetials": "true",
              },
              credentials: "include",
            }
          );
          const loadQuestions = await response.json();
          this.questions.push(loadQuestions);
          this.setCurrentQuestion();
        }
      } catch (e) {
        console.log(e);
      }
    },
    setCurrentQuestion() {
      this.current_question = this.questions.filter(item => item.order == this.current_question_id)[0];
    },
    answerQuestion() {
      this.isAnswered = true;
    },
    async handleNext(e, name) {
      // const result = await this.updateAnswer();
      this.progress = this.progress + 100 / this.quiz.number_of_questions;
      this.clearSelection(name);
      this.current_question_id++;
    },
    async updateAnswer() {
      const formData = new FormData();

      formData.append("content", this.current_question.choices[this.user_answer].content);
      formData.append("is_correct", this.current_question.choices[this.user_answer].is_correct);
      formData.append("student_id", this.user_id);
      formData.append("choice_id", this.current_question.choices[this.user_answer].id);

      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      try {
        const response = await fetch("http://localhost:8000/quizzes/" + this.quiz.id + "/questions/" + this.current_question_id + "/answer", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credetials": "true",
            },
            credentials: "include",
            body: JSON.stringify(data),
        });
        const data = await response.json();
        console.log(data);
      } catch(e) {
        console.log(e);
      }
    },
    async finishQuiz() {
      try {
        const response = await fetch("http://localhost:8000/quizzes/1/finish", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credetials": "true",
            },
            credentials: "include",
        });
        const data = await response.json();
        console.log(data);
      } catch(e) {
        console.log(e)
      }
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
  created() {
    this.code = this.$route.params.id;
    this.loadQuiz();
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
  height: 120px;
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