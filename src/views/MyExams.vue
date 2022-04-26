<template>
  <div>
    <h1>My Quizzes</h1>
    <router-link to="/my-exams/create-new"><button class="btn">Create new</button></router-link>
    <div class="exam-list">
      <div class="exam" v-for="exam in exams" :key="exam.id">
        <div class="me-auto">
          <h2>{{ exam.exam_name}}</h2>
          <p>{{ exam.total_items }} Questions</p>
        </div>
        <div class="exam-icon mb-auto">
          <router-link :to="`/my-exams/${exam.id}`"><font-awesome-icon icon="pen-to-square" /></router-link>
          <font-awesome-icon icon="trash-can" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      exams: [
        {
          exam_name: 'Quiz #1',
          total_items: 30,
          score: 25,
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
  // mounted() {
  //   fetch('http://localhost:8000/quizzes', {
  //     method: 'GET',
  //     credentials: 'include'
  //     })
  //     .then(res => res.json())
  //     .then(data => console.log(data))
  //     .catch(err => console.log(err))
  // }
}
</script>

<style scoped>
.btn {
  /* position: absolute;
  right: 120px; */
  float: right;
}
.exam-icon {
  font-size: 2em;
}
.exam-icon svg {
  color: #93989c;
  margin-left: 15px;
}
</style>