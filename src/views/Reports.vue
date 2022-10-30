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
            <h1 class="me-auto">{{ this.quiz_name }}</h1>
            
            <button type="button" class="btn-close" @click="showModal = !showModal"></button>
          </div>
          <p>Questions where the system detected cheating behavior are marked with <font-awesome-icon icon="circle-exclamation" class="cheating"/> symbol.</p>
          <div class="accordion mt-1" id="report-list">

            <div class="accordion-item" v-for="(student, index) in this.quizActions" :key="index">
              <div class="accordion-header" :id="['heading'+index]">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#reportCollapse'+index" aria-expanded="true" :aria-controls="['reportCollapse'+index]">
                  <div class="me-auto p-2">
                    <h3>{{ student.student_name }}</h3>
                    <p>Score: {{ student.score }}</p>
                  </div>
                </button>
              </div>
              <div :id="['reportCollapse'+index]" class="accordion-collapse collapse show" :aria-labelledby="['heading'+index]" data-bs-parent="#report-list">
                <div class="accordion-body">
                  <table class="table table-bordered table-light  mouse-data">
                    <thead>
                       <tr>
                        <th width="20%"></th>
                        <th>Focus</th>
                        <th>Blur</th>
                        <th>Copy</th>
                        <th>Paste</th>
                        <th>Left Click</th>
                        <th>Right Click</th>
                        <th>Double Click</th>
                        <th width="4%" class="hide-cell"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(action, key, index) in student.actions" :key="index">
                        <td>Q{{ index+1 }} Frequency</td>
                        <td>{{ action.focus }}</td>
                        <td>{{ action.blur }}</td>
                        <td>{{ action.copy_ }}</td>
                        <td>{{ action.paste }}</td>
                        <td>{{ action.left_click }}</td>
                        <td>{{ action.right_click }}</td>
                        <td>{{ action.double_click }}</td>
                        <td width="5%" class="hide-cell"><font-awesome-icon icon="circle-exclamation" class="cheating"/></td>
                      </tr>
                    </tbody>
                  </table>
                  <button class="btn btn-main" @click="downloadPDF(index, student.student_name, student.actions)">Download Quiz Logs</button>
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
      quizActions: [],
      actionLogs: [],
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
          this.quizzes[index].number_of_participants = data.length;
          index++;
        } catch(e) {
          // console.log(e);
        }
      }
    },
    openModal(index){
      this.resetValues();
      this.quiz_id = this.quizzes[index].id;
      this.quiz_name = this.quizzes[index].name;
      this.showModal = true;
      this.loadQuizActions();
    },
    resetValues() {
      this.quiz_id = '',
      this.quiz_name = '';
    },
    async downloadPDF(id, name, actions) {
      this.actionLogs = [];
      const question_ids = Object.keys(actions);
      let index = 0;
      for(const question_id of question_ids) {
        try {
          const response = await fetch(`${config.apiURL}/quizzes/${this.quiz_id}/questions/${question_id}/${id}/actions`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Credetials": "true",
            },
            credentials: "include",
          });
          const data = await response.json();
          
          const removeZeroes = item => (
            Object
              .keys(item)
              .filter(key => item[key] !== 0)
              .reduce((newObj, key) => {
                newObj[key] = item[key];
                return newObj;
              }, {})
          );
          
          for(const action of data) {
            const tempArray =  [];
            const filtered = removeZeroes(action);
            tempArray.push(index+1);
            if(filtered.focus) {
              tempArray.push("focus");
            } else if(filtered.blur) {
              tempArray.push("blur");
            } else if(filtered.copy_) {
              tempArray.push("copy");
            } else if(filtered.paste) {
              tempArray.push("paste");
            } else if(filtered.left_click) {
              tempArray.push("left click");
            } else if(filtered.right_click) {
              tempArray.push("right click");
            } else if(filtered.double_click) {
              tempArray.push("double click");
            }
            tempArray.push(action.time.slice(0,10));
            tempArray.push(action.time.slice(11,19));
            this.actionLogs.push(tempArray);
          }

          index++
        } catch(e) {
          // console.log(e);
        }
      }

      const doc = new jsPDF('p', 'mm', 'letter');
      doc.setFontSize(24);
      doc.text("Input Device Logs", 108, 25.4, 'center');
      
      doc.setFontSize(12);
      doc.text("Quiz Name: ", 25.4, 40);
      doc.text("Student Name: ", 25.4, 47);
      doc.text(this.quiz_name, 48.4, 40);
      doc.text(name, 54, 47);

      autoTable(doc, {
        head: [['Question #', 'Action', 'Date', 'Time']],
        body: this.actionLogs, styles: { halign: 'center' },
        startY: 55, 
        margin: 25.4
      })
      // doc.autoTable({ html: '#eventLogsTable', startY: 55, margin: 25.4})

      doc.save(this.quiz_name + "-" + name + "-logs.pdf");
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

.accordion-body button {
  display: block;
  margin-left: auto;
}
</style>
