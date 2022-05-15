<template>
  <div class>
    <div class="titlebox">
      <h1>Quiz Result:</h1>
    </div>

    <div class="resultbox">
      <h3 id="results">You got {{ current_quiz.score }} out of {{ current_quiz.total }} for this quiz!</h3>
    </div>

    <div class="question-list" v-if="is_due_date">
      <div class="question" v-for="(question,index) in questions" :key="question.id">
        <div class="d-flex">
          <h4>Question {{ index + 1 }}</h4>
          <span class="points" v-if="question.points==1">({{ question.points }} point)</span>
          <span class="points" v-else>({{ question.points }} points)</span>
        </div>
        <p>{{ question.content }}</p>
        <div class="ms-3">
          <div v-for="item in question.choices" :key="item.id">
            <div class="choices" :class="{wrong: item.is_answer, answer: item.is_correct,}">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-page text-center">
      <img class="" src="@/assets/empty-page.png" alt="">
      <h3>Answer key is unvailable until</h3>
      <h2 style="color: #3EB489; font-weight: 700">{{due_date}}</h2>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        id: '',
        code: '',
        total_point: '',
        quizzes: [],
        current_quiz: [],
        questions_id: [],
        questions: [],
        current_question : [],
        is_due_date: false,
        due_date: ''
    };
  },
  methods: {
    getDate() {
      var due = new Date(this.current_quiz.due_date);
      this.due_date = due.toString().substr(4,17);
      var currentDate = new Date();

      if(currentDate >= due) {
        this.is_due_date = true
      } else {
        this.is_due_date = false
      }
    },
    async loadQuizzesResult() {
      try {
        const response = await fetch("http://localhost:8000/quizzes/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
        });
        const data = await response.json();
        this.quizzes = data;

        this.getCurrentQuiz();
        this.id = this.current_quiz.id;

        for (const question of this.current_quiz.questions) {
          this.questions_id.push(question.id);
        }

        const result = await this.loadQuestions();

        this.setUserAnswer();
        
      } catch(e) {
        // console.log(e);
      }
    }, 
    getCurrentQuiz() {
      try {
        this.current_quiz = this.quizzes.filter(item => item.quiz_code == this.code)[0];
      } catch(e) {
        // console.log(e)
      }
    },
    setUserAnswer() {
      for(const answer of this.current_quiz.answers) {
        this.current_question = this.questions.filter(question => question.id == answer.question_id)[0];
        for(const choice of this.current_question.choices) {
          const a = choice.id;
          const b = answer.choice_id;
          if(a == b) {
            choice.is_answer = true;
          } else {
            choice.is_answer = false;
          }
        }
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
      } catch(e) {
        // console.log(e);
      }
    },
    computeTotal() {
      this.total_point = 0;
      this.current_quiz.questions.forEach(question => {
        this.total_point += question.points;
      });
    }
  },
  async created() {
      this.code = this.$route.params.id;
      const result = await this.loadQuizzesResult();
      this.computeTotal();
      this.current_quiz.total = this.total_point
      this.getDate();
  }
};
</script>


<style scoped>
.titlebox {
  width: 100%;
  margin: auto;
}

.resultbox {
  width: 100%;
  height: auto;
  background-color: white;
  border-radius: 10px;
  display: block;
  padding: 20px;
}
#results {
  font-weight: 700;
  text-align: center;
}
.exam-icon {
  font-size: 1.5em;
}

.exam-icon svg {
  color: #93989c;
  margin-left: 15px;
}

.question-list {
  margin-top: 30px;
  height: 65%;
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

.points {
  font-size: 16px;
  font-style: italic;
  color: gray;
  margin: 3px 0px 0px 3px;
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

.wrong {
  background-color: rgb(210, 105, 105);
  color: white;
}

.answer{
  background-color: rgb(105, 210, 105);
  color: white;
}
</style> 