<template>
  <div class>
    <div class="titlebox">
      <h1>Quiz Result:</h1>
    </div>

    <div class="resultbox">
      <h3 id="results">You got 4 out of 5 for this quiz!</h3>
    </div>

    <div class="question-list" v-if="this.$route.path.slice(0, 12) === '/activities/'">
      <div class="question" v-for="question in questions" :key="question.id">
        <div class="d-flex">
          <h4>Question {{ question.id }}</h4>
        </div>
        <p>{{ question.question }}</p>
        <div class="ms-3">
          <div v-if="question.choices.length === 0">
            <div v-for="fill in question.fill" :key="fill">
              <div class="choices answer">{{ fill }}</div>
            </div>
          </div>
          <div v-for="item in question.choices" :key="item.id">
            <div class="choices" :class="{answer: item.is_correct, wrong: item.choice === 'Virus',}">
              {{ item.choice }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        id: '',
        quizzes: [],
        questions: [],
    //   questions: [
    //     {
    //       id: 1,
    //       question:
    //         "Which of the following attacks require a carrier file to replicate?",
    //       choices: [
    //         { id: 1, choice: "Virus", is_correct: false },
    //         { id: 1, choice: "Trojan", is_correct: true },
    //         { id: 1, choice: "Worm", is_correct: false },
    //         { id: 1, choice: "Adware", is_correct: false },
    //       ],
    //     },
    //     {
    //       id: 2,
    //       question:
    //         "What wireless protocols is designed for transmitting data over short distances?",
    //       choices: [],
    //       fill: ["bluetooth"],
    //     },
    //     {
    //       id: 3,
    //       question:
    //         "What technology can collect information to make decisions, reach conclusions, and combine information in new ways?",
    //       choices: [
    //         { id: 1, choice: "Virtual Reality", is_correct: false },
    //         { id: 1, choice: "Embedded Computers", is_correct: false },
    //         { id: 1, choice: "Artificial Intelligence", is_correct: true },
    //         { id: 1, choice: "Robotics", is_correct: false },
    //       ],
    //     },
    //     {
    //       id: 4,
    //       question:
    //         "What types of activities are ideal for a robot to perform?",
    //       choices: [
    //         { id: 1, choice: "Creative Design Work", is_correct: false },
    //         { id: 1, choice: "Critical Thinking", is_correct: false },
    //         { id: 1, choice: "Repetitive Tasks", is_correct: true },
    //         { id: 1, choice: "Group Interaction", is_correct: false },
    //       ],
    //     },
    //     {
    //       id: 5,
    //       question:
    //         "During the encapsulation process, what occurs at the data link layer?",
    //       choices: [
    //         { id: 1, choice: "No address is added.", is_correct: false },
    //         {
    //           id: 1,
    //           choice: "The logical address is added",
    //           is_correct: false,
    //         },
    //         {
    //           id: 1,
    //           choice: "The physical address is added",
    //           is_correct: true,
    //         },
    //         {
    //           id: 1,
    //           choice: "The process port number is added.",
    //           is_correct: false,
    //         },
    //       ],
    //     },
    //   ],
    };
  },
  methods: {
    async loadQuizzes() {
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
        console.log(this.quizzes)
        
      } catch(e) {
        console.log(e);
      }
    }
  },
  created() {
      this.id = this.$route.params.id;
      this.loadQuizzes();
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

.wrong {
  background-color: rgb(210, 105, 105);
  color: white;
}
</style> 