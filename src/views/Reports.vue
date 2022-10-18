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
              <td><button class="btn btn-main" @click="openModal(index, quiz.id)">View</button></td>
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
            <h1 class="me-auto">Quiz #1</h1>
            
            <button type="button" class="btn-close" @click="showModal = !showModal"></button>
          </div>
          <p>Questions where the system detected cheating behavior are marked with <font-awesome-icon icon="circle-exclamation" class="cheating"/> symbol.</p>
          <div class="accordion mt-1" id="report-list">

            <div class="accordion-item">
              <div class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  <div class="me-auto p-2">
                    <h3>Nico</h3>
                    <p>Score: 5/5</p>
                  </div>
                </button>
              </div>
              <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  <div class="w-100 d-flex p-2">
                    <div class="me-2"><strong>Time Taken:</strong></div>
                    <div class="me-auto"> 10 mins</div>
                  </div>
                  <table class="table table-bordered table-light mouse-data">
                    <thead>
                       <tr>
                        <th width="20%"></th>
                        <th>Focus</th>
                        <th>Blur</th>
                        <th>Copy</th>
                        <th>Paste</th>
                        <th>Left Click</th>
                        <th>Right CLick</th>
                        <th>Double Click</th>
                        <th width="4%" class="hide-cell"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Average Frequency of Non-Cheating</td>
                        <td>2</td>
                        <td>2</td>
                        <td>3</td>
                        <td>5</td>
                        <td>75</td>
                        <td>50</td>
                        <td>85</td>
                        <td class="hide-cell"></td>
                      </tr>
                    </tbody>
                  </table>

                  <table class="table table-bordered table-light  mouse-data">
                    <thead>
                       <tr>
                        <th width="20%"></th>
                        <th>Focus</th>
                        <th>Blur</th>
                        <th>Copy</th>
                        <th>Paste</th>
                        <th>Left Click</th>
                        <th>Right CLick</th>
                        <th>Double Click</th>
                        <th width="4%" class="hide-cell"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Q3 Frequency</td>
                        <td>2</td>
                        <td>2</td>
                        <td>3</td>
                        <td>5</td>
                        <td>75</td>
                        <td>50</td>
                        <td>85</td>
                        <td width="5%" class="hide-cell"><font-awesome-icon icon="circle-exclamation" class="cheating"/></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
      quiz_id: '',
      quiz_name: '',
      subject: '',
      date_created: '',
      average: '',
      average_score: '',
      total_point: '',
      total_score: '',
      students: [],
      quizActions: []
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
        this.showEmptyPage = true;
      }
      this.$store.commit('SET_SHOW_LOADING_SCREEN', false);
    },
    async loadQuizzes() {
      this.$store.commit('SET_SHOW_LOADING_SCREEN', true);
      try {
        const response = await fetch(`${config.apiURL}/quizzes/`, {
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
    async loadQuizActions() {
      try {
        const response = await fetch(`${config.apiURL}/quizzes/${this.quiz_id}/actions-per-question`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credetials": "true",
          },
          credentials: "include",
        });
        const data = await response.json();
        this.quizActions = data;
        console.log(this.quizActions);
      } catch(e) {
        // console.log(e);
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
      this.quiz_id = this.quizzes[index].id;
      this.quiz_name = this.quizzes[index].name;
      this.subject = this.quizzes[index].desc;
      this.average_score = this.quizzes[index].average;
      this.total_score = this.quizzes[index].total;
      this.date_created = this.quizzes[index].created_at.slice(0,10).replace(/-/g,"/");
      this.students = this.participants[index];
      this.showModal = true;
      this.loadQuizActions();
    },
    resetValues() {
      this.quiz_id = '',
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
  /* width: 55% !important;
  min-width: 500px; */
  height: 88% !important;
}
.accordion {
  height: 85%;
  overflow: auto;
}
.accordion-item {
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
  margin-right: 10px;
  /* padding: 20px 30px; */
  min-height: 120px;
  border-radius: 10px;
  transition: 0.3s;
}

.accordion-item:hover {
  /* background-color: rgba(228, 228, 228, 0.1); */
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.detected {
  border: 1px solid #950000;
  background-color: rgb(255, 212, 212);
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

td {
  background-color: white;
}

table.mouse-data th {
  position: relative;
  font-weight: 300 !important;
}

.hide-cell {
  background: transparent !important;
  border-style: hidden;
  /* color: black !important; */
}

.cheating {
  color: rgb(202, 3, 3) !important;
  font-size: 1.2em;
}
</style>
