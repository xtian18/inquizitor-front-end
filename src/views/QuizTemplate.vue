<template>
<div class="container" 
@click="leftclick++"
@dblclick="doubleclick++"
@copy="copyActivated++"
@paste="pasteActivated++"
@mouseleave="mouseOnQuiz=false, mouseleave++"
@mouseenter="mouseOnQuiz=true, mousereenter++">
    <div class="titlebox">
        <h1>Exam #1 </h1>
        <!--
        <p>Number of left clicks: {{ leftclick }}</p>
        <p>Number of double clicks: {{ doubleclick }}</p>
        <p>Number of mouse leave: {{ mouseleave }}</p>
        <p>Number of mouse re-enter: {{ mousereenter }}</p>
        <p>Copy Activated: {{ copyActivated }}</p>
        <p>Paste Activated: {{ pasteActivated }}</p>
        -->
    </div>

    <!--Will appear if user leaves the quiz area, remove comment tag to activate
    <div class="warning">
        <h4 v-if="!mouseOnQuiz" style="color:red;">WARNING! MOUSE CURSOR HAS LEFT THE QUIZZING AREA</h4>
    </div>
    -->


    <div class="quizbox">
        <!--Displays Question number-->
        Question {{ quiz[currentIndex]['id'] }}: {{ quiz[currentIndex]['question'] }}<br>
        <div class="answers" v-for="answer,key in quiz[currentIndex]['options']" :key="key">
            <!--Displays Answers-->
            <input type="radio" default="none" name="answer" :id="key" :value="key" 
            @click="quiz[currentIndex]['isAnswered']=true" 
            @change="answered($event)">
                <label :for="key">
                    <p> {{ answer }}</p>
                </label>
        </div>
    </div>

    <!--Displays next button. Will disable if no answer selected-->
    <div class="navbox">
        <!--Submit button, must connect to QuizResult-->
        <input type="submit" v-if:="currentIndex == quiz.length - 1" class="btn" @click="checkAnswer($event)" :disabled="!quiz[currentIndex]['isAnswered']">
        <button class="btn" v-if="currentIndex < quiz.length - 1" @click="checkAnswer($event)" :disabled="!quiz[currentIndex]['isAnswered']">
            <b>Next</b>
        </button>
    </div>
</div>
</template>

<script>
export default {
  data() {
    return {
        //Mouse Input w/ Copy/Paste 
        leftclick: 0,
        rightclick: 0,
        doubleclick: 0,
        mouseleave: 0,
        mousereenter: 0,
        copyActivated: 0,
        pasteActivated: 0,

        //Quiz Essentials
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
                question: 'Which of the following wireless protocols is designed for transmitting data over short distances?',
                answer: 'd',
                options: {a: 'Optical Fiber', b: 'Coaxial Cable', c: 'Twisted-Pair Cable', d: 'Bluetooth'},
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
  methods: {
      answered(e){
          this.userAnswer = e.target.value
      },
      checkAnswer(e){
          if (this.userAnswer == this.quiz[this.currentIndex]['answer']){
              this.points++
          }
          this.currentIndex++
      }
  }
}
</script>

<style scoped>
    .titlebox{
        width: 80%;
        height: 20%;
        margin: 2.5% 10%;
    }

    .quizbox{
        width: 80%;
        height: 50%;
        max-height: 70%;
        margin: 2.5% 10%;
        padding: 5%;
        background-color: #ffffff;
    }

    .navbox{
        width: 80%;
        height: 10%;
        margin: 2.5% 10%;
        text-align: right;
    }

    .answers{
        padding: 3px;
        margin: 2px;
    }

    .answers:hover{
        background-color: grey;
    } 
</style>