<template>
  <div>
    <h1>Reports</h1>

    <!-- show of no quizzes -->
    <div v-if="showEmptyPage" class="empty-page text-center">
      <img class="" src="@/assets/empty-page.png" alt="">
      <h3>You haven't created any quizzes yet</h3>
      <h2 class="empty" @click="() => this.$router.push('/my-quizzes')">Go to My Quizzes</h2>
    </div>

    <!-- tabular reports -->
    <div class="report-container" v-else>
      <div class="table-wrapper">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Quiz Name</th>
              <th>Code</th>
              <th>Number of Participants</th>
              <th>Reports</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quiz,index) in quizzes" :key="quiz.id">
              <td>{{ quiz.name }}</td>
              <td>{{ quiz.quiz_code }}</td>
              <td>{{ quiz.number_of_participants }}</td>
              <td><button class="btn btn-main" @click="openModal(index)">View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- reports modal -->
    <teleport to="#app">
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-container">
          <div class="d-flex">
            <h1 class="me-auto">{{ quiz_name }}</h1>
            <button type="button" class="btn-close action" @click="showModal = !showModal"></button>
          </div>

          <div class="report-modal-container d-flex">
            <div>

              <div class="d-flex">
                <div class="w-50">
                  <p><strong>Examiner:</strong> {{ examiner }}</p>
                  <p><strong>Subject:</strong> {{ subject }}</p>
                </div>
                <div class="w-50">
                  <p><strong>Average Score:</strong> {{ average_score }}/{{ total_score }}</p>
                  <p><strong>Date Created:</strong> {{ date_created }}</p>
                </div>
              </div>

              
              <div class="table-wrapper2">
                <table class="table table-striped table-hover" id="table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(student, index) in students" :key="index">
                      <td>{{ student.participant_name }}</td>
                      <td>{{ student.score }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button class="btn btn-main ms-auto" style="float:right;" @click="downloadPDF">Export as PDF File</button>
            </div>

          </div>
        </div>
      </div>
    </teleport>

  </div>
</template>

<script>
import config from '../../config';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
  data() {
    return {
      showModal: false,
      showEmptyPage: false,
      quizzes: [],
      participants: [],
      quiz_name: '',
      subject: '',
      date_created: '',
      average: '',
      average_score: '',
      total_point: '',
      total_score: '',
      students: [],
    }
  },
  computed: {
    examiner() {
      return this.$store.state.user.full_name;
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
        const response = await fetch(`${config.apiURL}/quizzes`, {
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
    async loadParticipants() {
      let index = 0;
      for(const quiz of this.quizzes) {
        try {
          const response = await fetch(`${config.apiURL}/quizzes/${quiz.id}/results`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credetials": "true",
            },
            credentials: "include",
          });
          const data = await response.json();
          this.participants[index] = data;
          this.quizzes[index].number_of_participants = data.length;
          this.getAverage(index);
          this.quizzes[index].average = this.average;
          this.computeTotal(index);
          this.quizzes[index].total = this.total_point;
          index++;
        } catch(e) {
          // console.log(e);
        }
      }
    },
    getAverage(index) {
      let total = 0;
      this.average = 0;
      this.participants[index].forEach(participant => {
        total += participant.score;
      });
      
      if(this.participants[index].length) {
        this.average = Math.round(total/this.participants[index].length);
      } else {
        this.average = 0;
      }
    },
    computeTotal(index) {
      this.total_point = 0;
      this.quizzes[index].questions.forEach(question => {
        this.total_point += question.points;
      });
    },
    openModal(index){
      this.resetValues();
      this.quiz_name = this.quizzes[index].name;
      this.subject = this.quizzes[index].desc;
      this.average_score = this.quizzes[index].average;
      this.total_score = this.quizzes[index].total;
      this.date_created = this.quizzes[index].created_at.slice(0,10).replace(/-/g,"/");
      this.students = this.participants[index];
      this.showModal = true;
    },
    resetValues() {
      this.quiz_name = '';
      this.subject = '';
      this.average_score = '';
      this.total_score = '';
      this.date_created = '';
      this.students = [];
    },
    downloadPDF() {
      const doc = new jsPDF('p', 'mm', 'letter');
      doc.setFontSize(24);
      doc.text(this.quiz_name + " Report", 108, 25.4, 'center');
      
      doc.setFontSize(12);
      doc.text("Examiner: ", 25.4, 40);
      doc.text("Average Score: ", 108, 40);
      doc.text("Subject: ", 25.4, 47);
      doc.text("Date Created: ", 108, 47);

      doc.text(this.examiner, 45.4, 40);
      doc.text(this.average_score + "/" + this.total_score, 138, 40);
      doc.text(this.subject, 42, 47);
      doc.text(this.date_created, 135, 47);

      doc.autoTable({ html: '#table', startY: 55, margin: 25.4})

      doc.save(this.quiz_name + " Report.pdf");
    }
  },
  async created() {
    const result = await this.loadQuizzes();
    const result2 = await this.loadParticipants();
    this.setEmptyPage();
  }
}
</script>

<style>
@media only screen and (max-width: 992px) {
  tr .btn {
  width: 80% !important;
}
}

.modal-container {
  width: 55% !important;
  min-width: 500px;
}
.student-list {
  height: 90%;
  overflow: auto;
}
.student-report {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
  margin-right: 10px;
  padding: 20px 30px;
  min-height: 120px;
  border-radius: 10px;
  transition: 0.3s;
}

.student-report:hover {
  background-color: rgba(228, 228, 228, 0.1);
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

p {
  margin-bottom: 0 !important;
}

p.percentage {
  font-size: 5em;
  font-weight: 700;
  color: #2d283e;
}

p.cheating {
  margin-top: -30px; 
  font-size: 0.95em;
}

.report-container {
  background-color: white;
  border-radius: 10px;
  margin-top: 40px;
  padding: 20px;
  width: auto;
  height: 72%;
  max-height: 72%;
}

.report-modal-container {
  height: 90%;
}

.table-wrapper {
  padding-right: 5px;
  max-height: 100%;
  overflow: auto;
}

.table-wrapper2 {
  width: 100%;
  margin-top: 10px;
  padding-right: 5px;
  height: auto;
  max-height: 400px;
  margin-bottom: 10px;
  overflow: auto;
}

table {
  table-layout: fixed;
  word-wrap: break-word;
  text-align: center;
}

th{
  position: sticky;
  top: 0;
  background-color: #272A3F !important;
  color: white;
}

tr .btn {
  width: 40%;
  height: 95%;
  padding: 2px;
  font-size: 0.8em;
}

table.mouse-data th {
  position: relative;
  font-weight: 300 !important;
}
</style>
