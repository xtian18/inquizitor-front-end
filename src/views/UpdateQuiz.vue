<template>
  <div>
    <h1>My Quizzes > Quiz #1</h1>
    <button class="btn ms-2">Save</button>
    <button class="btn" @click="showModal = true">Add Question</button>

    <div class="question-list">
      <div class="resultbox d-flex">
        <div class="form-group me-4 quiz-name">
          <label for="username">Quiz Name:</label>
          <input type="text" id="username" value="Exam #1">
        </div>
        <div class="form-group">
          <label for="password">Time Limit (min):</label>
          <input type="text" id="password" value="30">
        </div>
      </div>
      <div class="question" v-for="question in questions" :key="question.id">
        <div class="d-flex">
          <h4>Question {{ question.id }}</h4>
          <div class="exam-icon ms-auto">
            <font-awesome-icon icon="pen-to-square" />
            <font-awesome-icon icon="trash-can" />
          </div>
        </div>
        <p>{{ question.question }}</p>
        <div class="ms-3">
          <div v-if="question.choices.length===0">
            <div v-for="fill in question.fill" :key="fill">
              <div class="choices answer" >{{ fill }}</div>
            </div>
          </div>
          <div v-for="item in question.choices" :key="item.id">
            <!-- <input type="radio" :id="id" :name="question.id" value="a">
            <label :for="id" class="ms-2"></label><br> -->
            <div class="choices" :class="{ answer: item.is_correct}">{{ item.choice }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- new question modal -->
    <teleport to="#app">
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-container">
          <div class="d-flex">
            <h1 class="me-auto">Question</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="showModal = !showModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="form-group pb-2">
                <label for="type">Question Type:</label>
                <div class="question-type">
                  <input type="radio" id="multiple" name="question_type" value="a" v-model="question_type">
                  <label for="multiple" class="ms-2">Multiple Choice&nbsp&nbsp&nbsp&nbsp</label>
                  <input type="radio" id="fill" name="question_type" value="b" v-model="question_type">
                  <label for="fill" class="ms-2">Fill-in-the-Blank</label>
                </div>

                <label for="question" class="mt-3">Question:</label>
                <textarea name="question" id="question" cols="30" rows="30" v-model="new_question"></textarea>
                
                <label class="mt-3">Answer:</label>
                <!-- multiple choice -->
                <div class="w-100" v-if="question_type === 'a'">
                  <div class="w-100 d-flex" v-for="(item, index) in multiple_choice" :key="index">
                    <input type="radio" id="1" name="choice" value="a">
                    <label for="1" class="ms-2 w-100">
                      <input type="text" v-model="item.value">
                    </label>
                    <button class="round" @click="deleteChoice(index)" v-if="multiple_choice.length > 2">
                      <font-awesome-icon icon="trash-can" />
                    </button>
                  </div>
                  <div class="d-flex w-100"><button class="round mx-auto" @click="addChoice" v-if="multiple_choice.length < 4">+</button></div>
                </div>
                <!-- fill-in-the-blank -->
                <div v-if="question_type === 'b'">
                  <div class="w-100 d-flex" v-for="(item, index) in fill_in_the_blank" :key="index">
                    <input class="radio" type="text" v-model="item.value">
                    <button class="round" @click="deleteAnswer(index)" v-if="fill_in_the_blank.length > 1">
                      <font-awesome-icon icon="trash-can" />
                    </button>
                  </div>
                  <div class="d-flex w-100"><button class="round mx-auto" @click="addAnswer" v-if="fill_in_the_blank.length < 4">+</button></div>
                </div>
                
              </div>
            </form>
          </div> 
          <div class="bottom">
            <button class="btn ms-2">Save</button>
            <button class="btn" @click="showModal = true">Cancel</button>
          </div>
        </div>
      </div>
    </teleport>

  </div>
</template>

<script>
export default {
  data() {
    return {
      new_question: '',
      new_choices: '',
      new_fill: '',
      showModal: false,
      question_type: 'a',
      multiple_choice: [
        {
          value: ''
        },
        {
          value: ''
        }
      ],
      fill_in_the_blank: [''],
      id: '',
      exam_name: '',
      questions: [
          {
              id: 1,
              question: "What year did Red Velvet debut?",
              choices: [
                {id: 1, choice: '2013', is_correct: false},
                {id: 1, choice: '2014', is_correct: true},
                {id: 1, choice: '2015', is_correct: false},
                {id: 1, choice: '2016', is_correct: false}
              ]
          },
          {
              id: 2,
              question: "What is Red Velvet's debut song?",
              choices: [],
              fill: ['Hapiness','hapiness']
          },
          {
              id: 3,
              question: "Which members debuted as a subunit in 2020 with Monster EP?",
              choices: [
                {id: 1, choice: 'Joy and Irene', is_correct: false},
                {id: 1, choice: 'Wendy and Seulgi', is_correct: false},
                {id: 1, choice: 'Yeri and Joy', is_correct: false},
                {id: 1, choice: 'Irene and Seulgi', is_correct: true}
              ]
          },
      ],
      exams: [
        {
          exam_name: 'Exam #1',
          total_items: 30,
          score: 25,
          id: 1
        },
        {
          exam_name: 'Exam #2',
          total_items: 15,
          score: 12,
          id: 2
        },
        {
          exam_name: 'Exam #3',
          total_items: 20,
          score: 18,
          id: 3
        },
        {
          exam_name: 'Exam #4',
          total_items: 10,
          score: 8,
          id: 4
        },
        {
          exam_name: 'Exam #5',
          total_items: 30,
          score: 20,
          id: 5
        }
      ]
    }
  },
  methods: {
    addChoice() {
      this.multiple_choice.push({ value: '' });
      console.log(this.multiple_choice)
    },
    deleteChoice(index) {
      this.multiple_choice.splice(index, 1);
    },
    addAnswer() {
      this.fill_in_the_blank.push('');
    },
    deleteAnswer(index) {
      this.fill_in_the_blank.splice(index, 1);
    },
    resetModal() {
      this.question_type = 'a';
      this.fill_in_the_blank = []
      this.new_question = ''
    }
  },
  created() {
    this.id = this.$route.params.id;  
    console.log(this.id)
  }
}
</script>

<style scoped>
.resultbox{
  height: auto;
  background-color: white;
  border-radius: 10px;
  display: block;
  padding: 20px 30px;
  margin-bottom: 10px;
  margin-right: 10px;
}
#results{
  font-weight: 700;
  text-align: center;
}
.quiz-name {
  width: 70%;
}
.btn {
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

input[type = text] {
  margin-bottom: 10px;
  height: 40px;
}
input[type="radio"]{
  transform: scale(2);
  position: relative;
  top: 14px;
  left: -1px;
}
input[type='radio']:after {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  top: -4px;
  left: -2px;
  position: relative;
  background-color: #d1d3d1;
  content: '';
  display: inline-block;
  visibility: visible;
  border: 2px solid white;
}
input[type='radio']:checked:after {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  top: -4px;
  left: -2px;
  position: relative;
  background-color: #3d3657;
  content: '';
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