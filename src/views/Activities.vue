<template>
  <div>
    <h1>Activities</h1>

    <div v-if="showEmptyPage" class="empty-page text-center">
      <img class="" src="@/assets/empty-page.png" alt="">
      <h3>You haven't answered any quizzes yet</h3>
      <h2 class="empty" @click="() => this.$router.push('/take-quiz')">Take a quiz now!</h2>
    </div>

    <div class="exam-list" v-else>
      <div class="exam" v-for="quiz in quizzes" :key="quiz.id">
        <router-link :to="`/activities/${quiz.quiz_code}`">
          <div class="w-100 d-flex">
            <div class="me-auto">
              <h2>{{ quiz.name }}</h2>
              <p>{{ quiz.number_of_questions }} Questions</p>
            </div>
            <p class="score my-auto ">{{ quiz.score }}/{{ quiz.total}}</p>
          </div>
        </router-link>
      </div>
    </div>

  </div>


</template>

<script>
export default {
  data() {
    return {
      showEmptyPage: false,
      total_point: 0,
      quizzes: [],
      exams: [
        {
          exam_name: 'Quiz #1',
          total_items: 5,
          score: 4,
          id: 1
        },
        {
          exam_name: 'Quiz #2',
          total_items: 15,
          score: 12,
          id: 2
        },
        {
          exam_name: 'Quiz #3',
          total_items: 20,
          score: 18,
          id: 3
        },
        {
          exam_name: 'Quiz #4',
          total_items: 10,
          score: 8,
          id: 4
        },
        {
          exam_name: 'Quiz #5',
          total_items: 30,
          score: 20,
          id: 5
        }
      ]
    }
  },
  methods: {
    setEmptyPage() {
      if(this.quizzes.length){
        this.showEmptyPage = false;
      } else {
        setTimeout(() => this.showEmptyPage = true, 100)
      }
    },
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
      } catch(e) {
        // console.log(e);
      }
    },
    computeTotal(index) {
      this.total_point = 0;
      this.quizzes[index].questions.forEach(question => {
        this.total_point += question.points;
      });
    }
  },
  async created() {
    const result = await this.loadQuizzes();
    let index = 0;
    for(const quiz of this.quizzes){
      this.computeTotal(index);
      this.quizzes[index].total = this.total_point
      index++;
    }
    this.setEmptyPage();
  }
}
</script>

<style>
.exam-list {
  margin-top: 70px;
  height: 72%;
  overflow: auto;
}

.exam-list .exam {
  display: flex;
  background-color: white;
  margin-bottom: 10px;
  margin-right: 10px;
  padding: 20px 30px;
  height: 120px;
  border-radius: 10px;
  transition: 0.3s;
}

.exam-list .exam:hover {
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.exam-list .exam h2 {
  color: #3EB489 ;
  text-decoration: none;
  font-weight: 600;
}

.exam-list .score {
  font-size: 2em;
}
a{
  width: 100%;
  text-decoration: none !important;
}
p {
  color: black;
}
</style>