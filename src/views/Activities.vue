<template>
  <div>
    <h1>Activities</h1>
    <div class="exam-list">
      <div class="exam" v-for="exam in exams" :key="exam.id">
        <router-link :to="`/activities/${exam.id}`">
          <div class="w-100 d-flex">
            <div class="me-auto">
              <h2>{{ exam.exam_name }}</h2>
              <p>{{ exam.total_items }} Questions</p>
            </div>
            <p class="score my-auto ">{{ exam.score }}/{{ exam.total_items }}</p>
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
  color: #f6a427 ;
  text-decoration: none;
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