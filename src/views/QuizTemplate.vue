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
            <p>Choose the best answer for each question. The quiz has a time limit. Once you click next, you can no longer go back to the previous questions. Good Luck!</p>
            </div>
            <div class="modal-foot text-center">
                <button class="btn" @click="startTimer">I understand</button>
            </div>
        </div>
      </div>
    </teleport>

    <!-- times-up modal -->
    <teleport to="#app">
      <div class="modal-overlay" v-if="time<=0">
        <div class="modal-container d-flex flex-column">
            <div class="modal-head text-center">
            <h1 class="me-auto">Time's Up!</h1>
            </div>
            <div class="modal-body text-center">
            <p>Time is over...Please Submit your work.</p>
            </div>
            <div class="modal-foot text-center">
                <button class="btn" @click="handleSubmit">OK</button>
            </div>
        </div>
      </div>
    </teleport>

    <div class="titlebox">
        <h1>Exam #1 </h1>
    </div>

    <div class="quiz-container">
        <div class="timer">
            <strong>Time Remaining:</strong> 
            <div class="time me-1">{{ display_minutes }}</div> min <div class="time me-1">{{ display_seconds }}</div> sec
        </div>
        <div class="quizbox">
            <div class="bar">
                <div class="quiz-progress" :style="{'width': progress + '%'}"></div>
            </div>
            <!--Displays Question number-->
            <div class="question">
                <p>Question {{ quiz[currentIndex]['id'] }}/{{ quiz.length }} </p>
                <div><p>{{ quiz[currentIndex]['question'] }}</p></div>
            </div>
            <div class="answer-list">
                <div v-if="Object.keys(this.quiz[this.currentIndex].options).length == 0">
                    <input type="text" :name="currentIndex" id="2" 
                    @keyup="isEmpty"
                    @change="answered($event)"
                    v-model="field">    
                </div>
                <div class="answers" v-for="answer,key in quiz[currentIndex]['options']" :key="key">
                    <!--Displays Answers-->
                    <input type="radio" default="none" :name="currentIndex" :id="key" :value="key"
                    @click="quiz[currentIndex]['isAnswered']=true"
                    @change="answered($event)">
                    <label :for="key">{{ answer }}</label>
                </div>
            </div>
        </div>
        <!--Displays next button. Will disable if no answer selected-->
        <div class="bottom">
            <!--Submit button, must connect to QuizResult-->
            <input type="submit" v-if:="currentIndex == quiz.length - 1" class="btn" @click="handleSubmit" :disabled="!quiz[currentIndex]['isAnswered']">
            <button class="btn" v-if="currentIndex < quiz.length - 1" @click="checkAnswer($event,currentIndex)" :disabled="!quiz[currentIndex]['isAnswered']">Next</button>
        </div>
    </div>


</div>
</template>

<script>
export default {
  data() {
    return {
        //Mouse Input w/ Copy/Paste 
        // leftclick: 0,
        // rightclick: 0,
        // doubleclick: 0,
        // mouseleave: 0,
        // mousereenter: 0,
        // copyActivated: 0,
        // pasteActivated: 0,
        //Quiz Essentials
        field: '',
        showInstruction: true,
        // startingMinutes: 30,
        time: 60,
        display_minutes: 0,
        display_seconds: 0,
        progress: 0,
        userAnswer: '',
        points: 0,
        currentIndex: 0,
        mouseOnQuiz: true,
        //Quiz Data
        quiz: [
            {
                question: 'Which of the following attacks require a carrier file to replicate?',
                answer: 'a',
                options: {a: 'Virus', b: 'Trojan', c: 'Worm', d: 'Adware'},
                isAnswered: false,
                id: 1
            },
            {
                question: 'What wireless protocols is designed for transmitting data over short distances?',
                answer: ['bluetooth'],
                options: {},
                isAnswered: false,
                id: 2
            },
            {
                question: 'What technology can collect information to make decisions, reach conclusions, and combine information in new ways?',
                answer: 'c',
                options: {a: 'Virtual Reality', b: 'Embedded Computers', c: 'Artificial Intelligence', d: 'Robotics'},
                isAnswered: false,
                id: 3
            },
            {
                question: 'What types of activities are ideal for a robot to perform',
                answer: 'c',
                options: {a: 'Creative Design Work', b: 'Critical Thinking', c: 'Repetitive Tasks', d: 'Group Interaction'},
                isAnswered: false,
                id: 4
            },
            {
                question: 'During the encapsulation process, what occurs at the data link layer?',
                answer: 'c',
                options: {a: 'No address is added.', b: 'The logical address is added', c: 'The physical address is added', d: 'The process port number is added.'},
                isAnswered: false,
                id: 5
            }
        ]
    }
  },
  computed: {
    // time() {
    //     return this.startingMinutes * 60;
    // }
  },
  methods: {
    isEmpty() {
        if(this.field!='') {
            this.quiz[this.currentIndex].isAnswered = true;
        }
    },
    answered(e){
        this.userAnswer = e.target.value
    },
    checkAnswer(e,name){
        if (this.userAnswer == this.quiz[this.currentIndex]['answer']){
            this.points++
        }
        this.progress = this.progress + (100/this.quiz.length);
        this.clearSelection(name);
        this.currentIndex++;
    },
    handleSubmit() {
        console.log(this.points)
        this.$router.replace(this.$route.path + '/result')
    },
    startTimer() {
        this.showRemaining();
        this.showInstruction = false;
    },
    showRemaining() {
        const timer = setInterval(() => {
            const minutes = Math.floor(this.time/60);
            const seconds = this.time % 60;

            this.display_minutes = minutes;
            this.display_seconds = seconds;

            if(this.time > 0){
                this.time--;
            }
        }, 1000);
    },
    clearSelection(name) {
        const radio_btn = document.querySelectorAll("input[type='radio'][name='"+name+"']");
        radio_btn.forEach(radio_btn => {
            if(radio_btn.checked===true) {
                radio_btn.checked = false;
            }
        })
    }
  },
  mounted() {
      this.showRemaining;
  }
}
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
    .titlebox{
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
    .timer{
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
    .quizbox{
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
    .bottom{
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
    .answers{
        padding: 3px;
        margin: 2px 0px;
    }
    input[type = "radio"] {
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
    input[type = "radio"]:checked + label {
        background-color: #d1d7e0;
    }


</style> 