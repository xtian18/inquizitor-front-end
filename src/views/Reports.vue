<template>
  <div>
    <LoadingScreen v-if="showLoadingScreen"></LoadingScreen>
    <h1>Reports</h1>

    <a class="help" @click="showHelp=true"><font-awesome-icon icon="circle-question" /></a>

    <!-- show of no quizzes -->
    <div v-if="showEmptyPage" class="empty-modal text-center">
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
              <td>{{ quiz[0].name }}</td>
              <td>{{ quiz[0].quiz_code }}</td>
              <td>{{ quiz.length - 1 }}</td>
              <td><button class="btn btn-main" @click="openModal(index)">View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- reports modal -->
    <teleport to="#app">
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-container d-flex flex-column">
          <div class="d-flex">
            <h1 class="me-auto">{{ this.quiz_name }}</h1>
            
            <button type="button" class="btn-close" @click="showModal = !showModal"></button>
          </div>
          <p>A student will have red border if the system detected atleast one question with cheating behavior. Questions where the system detected cheating behavior are marked with <font-awesome-icon icon="circle-exclamation" class="cheating"/> symbol. (Focus refers to going back to the quiz taking page while blur refers to leaving the quiz taking page)</p>

          <div v-if="isLoading" class="loading-container flex-grow-1">
            <div class="spinner-border"  style="width: 4em;height:4em;"></div>
          </div>

          <div v-else-if="isEmpty" class="empty-modal text-center flex-grow-1">
            <div>
              <img class="" src="@/assets/empty-page.png" alt="">
              <h3>No participants yet</h3>
            </div>
          </div>
          
          <div v-else class="accordion mt-1 flex-grow-1" id="report-list">

            <div class="accordion-item" :class="{ detected: student.cheated }" v-for="(student, index) in this.quizActions" :key="index">
              <div class="accordion-header" :id="['heading'+index]">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#reportCollapse'+index" aria-expanded="false" :aria-controls="['reportCollapse'+index]">
                  <div class="me-auto p-2">
                    <h3>{{ student.student_name }}</h3>
                    <p>Score: {{ student.score }}</p>
                  </div>
                </button>
              </div>
              <div :id="['reportCollapse'+index]" class="accordion-collapse collapse" :aria-labelledby="['heading'+index]" data-bs-parent="#report-list">
                <div class="accordion-body py-1 px-2">
                  <table class="table table-bordered table-light mouse-data">
                    <thead>
                       <tr>
                        <th width="20%"></th>
                        <th data-bs-toggle="tooltip" data-bs-placement="bottom" title="Refers to going back to the quiz taking page.">Focus</th>
                        <th data-bs-toggle="tooltip" data-bs-placement="bottom" title="Refers to leaving the quiz taking page.">Blur</th>
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
                        <td width="5%" class="hide-cell"><font-awesome-icon icon="circle-exclamation" class="cheating" v-if="action.label"/></td>
                      </tr>
                    </tbody>
                  </table>
                  <button class="btn btn-main" style="width: 250px;" @click="downloadPDF(index, student.student_name, student.actions)" :disabled="isDownloading">
                    <div v-if="isDownloading" class="spinner-border spinner-border-sm"></div>
                    Download Actions Logs
                  </button>
                </div>
              </div>
            </div>

          </div> 
        </div>
      </div>
    </teleport>

    <!-- help modal -->
    <HelpModal :showHelp="showHelp">
      <template v-slot:head>
        <h1>Need help?</h1>
        <button type="button" class="btn-close action" @click="showHelp=false,isOpen=0">
        </button>
      </template>
      <template v-slot:body>
        <div class="help-body accordion" id="help-list">
          <div class="accordion-item">
            <div class="accordion-header" id="help-heading1">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#help-collapse1" aria-expanded="false" aria-controls="help-collapse1">
                <span class="help-question">What can I see here?</span>
              </button>
            </div>
            <div id="help-collapse1" class="accordion-collapse collapse mt-3" aria-labelledby="help-heading1" data-bs-parent="#help-list">
              <div class="accordion-body">
                <ol>
                    <li>In the reports page, you can view all the quizzes you have created in a tabular format. Each row contains the quiz name, code, number of participants and a <strong>"View"</strong> button.</li><br>
                    <li>When you click the view button, a window will pop out showing the reports from each student who took the quiz and their scores. A student will have red border if the system detected atleast one question with cheating behavior.</li><br>
                    <li>You can click each student to show more information. Once expanded, you can see a table summarizing every input device events/actions. </li><br>
                    <li>You can also see a <font-awesome-icon icon="circle-exclamation" class="cheating"/> danger mark for questions where the system detected a cheating behavior. </li>
                </ol>
              </div>
            </div>
          </div>

          <div class="accordion-item">
            <div class="accordion-header" id="help-heading2">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#help-collapse2" aria-expanded="false" aria-controls="help-collapse2">
                <span class="help-question">What does each event/action mean?</span>
              </button>
            </div>
            <div id="help-collapse2" class="accordion-collapse collapse mt-3" aria-labelledby="help-heading2" data-bs-parent="#help-list">
              <div class="accordion-body">
                <ol>
                    <li>The table you can see for every student contains the total count of each input device events per question done by the student while taking the quiz. </li><br>
                    <ul>
                        <li><strong>Focus</strong> is when the student goes back to the quiz taking page.</li>
                        <li><strong>Blur</strong>, on the contrary, is when the student leaves the quiz taking page. This can be a switching window, opening a new tab, or clicking outside the page.</li>
                        <li><strong>Copy</strong> is when the student copied a text inside the quiz taking page through a keyboard shortcut (crtl+c) or from the context menu when right clicking.</li>
                        <li><strong>Paste</strong> is when the student pasted a text in the text box for fill-in-the-blank type questions. This can be done through a keyboard shortcut (crtl+v) or from the context menu when right clicking.</li>
                        <li><strong>Left Click</strong> is simply left clicking using the mouse or touchpad.</li>
                        <li><strong>Right Click</strong> is simply right clicking using the mouse or touchpad.</li>
                        <li><strong>Double Click</strong> is clicking the mouse or touchpad twice in quick succession.</li>
                    </ul><br>
                    <li>These events/actions are used by system to detect cheating behavior of students while taking a quiz.</li>
                </ol>
              </div>
            </div>
          </div>

          <div class="accordion-item">
            <div class="accordion-header" id="help-heading3">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#help-collapse3" aria-expanded="false" aria-controls="help-collapse3">
                <span class="help-question">How to view the input device logs?</span>
              </button>
            </div>
            <div id="help-collapse3" class="accordion-collapse collapse mt-3" aria-labelledby="help-heading3" data-bs-parent="#help-list">
              <div class="accordion-body">
                <ol>
                  <li>Open the reports modal and click the name of the student. Below the summary of events table, you can see the <strong>"Download Actions Log"</strong> button.</li><br>
                  <li>Once clicked, it will download a PDF file containing all the input device events done by the student while taking the quiz.</li><br>
                  <li>Inside the file, you can see a table containing the question number, what kind of event/action is done, date, and the time it is fired. </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:foot>
        <button class="btn btn-main float-end" @click="showHelp=false">OK</button>
      </template>
    </HelpModal>

  </div>
</template>

<script>
import config from '../../config';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import HelpModal from "@/components/HelpModal.vue";
import LoadingScreen from '@/components/LoadingScreen.vue';

export default {
  components: { HelpModal, LoadingScreen },
  data() {
    return {
      showHelp: false,
      showModal: false,
      showEmptyPage: false,
      showLoadingScreen: false,
      isLoading: false,
      isDownloading: false,
      isEmpty: true,
      quizzes: [],
      quiz_id: '',
      quiz_name: '',
      quizActions: [],
      actionLogs: [],
    }
  },
  methods: {
    setEmptyPage() {
      if(this.quizzes.length){
        this.showEmptyPage = false;
      } else {
        this.showEmptyPage = true;
      }
    this.showLoadingScreen = false;
    },
    async loadQuizzes() {
    this.showLoadingScreen = true;
      try {
        const response = await fetch(`${config.apiURL}/quizzes/results`, {
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
        
        for(const student in data) {
          let cheated = false;
          for(const action in data[student].actions) {
            if(data[student].actions[action].label) {
              cheated = true;
              break;
            }
          }
          data[student].cheated = cheated;
        }

        this.quizActions = data;
      } catch(e) {
        // console.log(e);
      }
      this.isLoading = false;
    },
    openModal(index){
      this.resetValues();
      this.quiz_id = this.quizzes[index][0].id;
      this.quiz_name = this.quizzes[index][0].name;
      if(this.quizzes[index].length > 1) {
        this.isEmpty = false;
      }
      this.showModal = true;
      this.isLoading = true;
      this.loadQuizActions();
    },
    resetValues() {
      this.quizActions = [];
      this.quiz_id = '',
      this.quiz_name = '';
      this.isEmpty = true;
    },
    async downloadPDF(id, name, actions) {
      this.isDownloading = true;
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
            let localTime = new Date(action.time);
            tempArray.push(localTime.toString().slice(4,16));
            tempArray.push(localTime.toString().slice(16,24));
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
        head: [['Question #', 'Action', 'Date', 'Time (HH:mm:ss)']],
        body: this.actionLogs, styles: { halign: 'center' },
        startY: 55, 
        margin: 25.4
      })

      doc.save(this.quiz_name + "-" + name + "-logs.pdf");

      this.isDownloading = false;
    }
  },
  async created() {
    const result = await this.loadQuizzes();
    this.setEmptyPage();
  }
}
</script>

<style scoped>
.empty-modal {
  width: 100%;
  position: relative;
}

.empty-modal > div {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%,-50%);
  transform: translate(-50%, -50%);
}

.empty-modal img {
  width: 40%;
  min-width: 200px;
}

.loading-container {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.modal-container {
  height: 88% !important;
}

.accordion {
  overflow-y: auto;
}

.detected {
  border: 3px solid #950000;
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
  height: auto;
  max-height: 72%;
  overflow: hidden;
}

.report-modal-container {
  height: 90%;
}

.table-wrapper {
  padding-right: 5px;
  height: 100%;
  max-height: 400px;
  overflow-y: auto;
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
}

.cheating {
  color: rgb(202, 3, 3) !important;
  font-size: 1.2em;
}

.accordion-body button {
  display: block;
  margin-left: auto;
}

@media only screen and (max-width: 992px) {
  table.mouse-data {
    display: block;
    max-width: -moz-fit-content;
    max-width: fit-content;
    margin: 0 auto;
    overflow-x: auto;
    white-space: nowrap;
    margin-bottom: 10px;
  }
  tr .btn {
    width: 80% !important;
  }
}
</style>
