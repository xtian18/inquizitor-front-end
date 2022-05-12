<template>
  <div class="container">

    <!-- instruction modal -->
    <teleport to="#app">
      <div class="modal-overlay" v-if="showInstruction">
        <div class="modal-container d-flex flex-column">
            <div class="modal-head text-center">
            <h1 class="me-auto">Instructions</h1>
            </div>
            <div class="modal-body text-center">
            <p>Choose the best answer for each question. Once you click next, you can no longer go back to the previous questions. Good Luck!</p>
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
    <!-- <button @click="test">test</button> -->

    <div class="quiz-container">
      <div class="quizbox mt-3">
        <div class="bar">
          <div class="quiz-progress" :style="{ width: progress + '%' }"></div>
        </div>

        <div class="question">
          <p>Question {{ question_num }}/{{ quiz.number_of_questions }} </p>
          <div>
            <p class="text-wrap text-break">{{ current_question.content }}</p>
          </div>
        </div>

        <div class="answer-list">
          <div class="answers" v-for="(choice,index) in current_question.choices" :key="choice.id">
            <input type="radio" default="none" name="sample" :id="choice.id" :value="index" @click="isAnswered=true" v-model="user_answer"/>
            <label :for="choice.id" class="text-wrap text-break">{{ choice.content }}</label>
          </div>
        </div>

      </div>

      <div class="bottom">
        <input type="submit" v-if:="current_question_id == quiz.number_of_questions - 1" class="btn btn-main" @click="handleSubmit" :disabled="!isAnswered"/>
        <button class="btn btn-main" v-if="current_question_id < quiz.number_of_questions - 1" @click="checkAnswer($event, currentIndex)" :disabled="!isAnswered">
          Next
        </button>
      </div>
      
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      showInstruction: true,
      progress: 0,
      user_answer: '',
      isAnswered: false,
      points: 0,
      //Quiz Data
      code: '',
      quiz: [],
      questions_id: [],
      questions: [],
      current_question: '',
      current_question_id: 0,
      quix: [
        {
          question:
            "Which of the following attacks require a carrier file to replicate?",
          answer: "a",
          options: { a: "Virus", b: "Trojan", c: "Worm", d: "Adware" },
          isAnswered: false,
          id: 1,
        },
        {
          question:
            "What wireless protocols is designed for transmitting data over short distances?",
          answer: ["bluetooth"],
          options: {},
          isAnswered: false,
          id: 2,
        },
        {
          question:
            "What technology can collect information to make decisions, reach conclusions, and combine information in new ways?",
          answer: "c",
          options: {
            a: "Virtual Reality",
            b: "Embedded Computers",
            c: "Artificial Intelligence",
            d: "Robotics",
          },
          isAnswered: false,
          id: 3,
        },
        {
          question: "What types of activities are ideal for a robot to perform",
          answer: "c",
          options: {
            a: "Creative Design Work",
            b: "Critical Thinking",
            c: "Repetitive Tasks",
            d: "Group Interaction",
          },
          isAnswered: false,
          id: 4,
        },
        {
          question:
            "During the encapsulation process, what occurs at the data link layer?",
          answer: "c",
          options: {
            a: "No address is added.",
            b: "The logical address is added",
            c: "The physical address is added",
            d: "The process port number is added.",
          },
          isAnswered: false,
          id: 5,
        },
      ],
    };
  },
  computed: {
    question_num() {
      return this.current_question_id + 1;
    },
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
        const response = await fetch(
          "http://localhost:8000/quizzes/" + this.code,
          {
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
          const response = await fetch("http://localhost:8000/quizzes/" + this.code + "/questions/" + id, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credetials": "true",
            },
            credentials: "include"
          });
          const loadQuestions = await response.json();
          this.questions.push(loadQuestions);
          this.setCurrentQuestion();
        }
      } catch(e) {
        console.log(e);
      }
    },
    setCurrentQuestion() {
      this.current_question = this.questions.filter(item => item.order == this.current_question_id)[0];
    },
    isEmpty() {
      if (this.field != "") {
        this.quix[this.currentIndex].isAnswered = true;
      }
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
        const response = await fetch("http://localhost:8000/quizzes/" + this.quiz.id + "/questions/" + this.questions[this.current_question_id].id + "/answer", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credetials": "true",
            },
            credentials: "include",
            body: JSON.stringify(data),
        });
        const check_answer = await response.json();
        console.log(check_answer);
      } catch(e) {
        console.log(e);
      }
    },
    async finishQuiz() {
      try {
        const response = await fetch("http://localhost:8000/quizzes/" + this.quiz.id + "/finish",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credetials": "true",
            },
            credentials: "include",
          }
        );
        const finish = await response.json();
        console.log(finish)
      } catch (e) {
        console.log(e);
      }
    },
    // answered(e) {
    //   this.user_answer = e.target.value;
    // },
    async checkAnswer(e, name) {   
      const result = await this.updateAnswer();
      this.progress = this.progress + 100 / this.quiz.number_of_questions;
      this.clearSelection(name);
      this.current_question_id++;
      this.setCurrentQuestion();
    },
    async handleSubmit() {
      const result = await this.updateAnswer();
      this.progress = this.progress + 100 / this.quiz.number_of_questions;
      const result2 = await this.finishQuiz();
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