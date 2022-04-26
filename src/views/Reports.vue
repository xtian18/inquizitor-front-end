<template>
  <div>
    <h1>Reports</h1>
    <div class="report-container">
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
            <tr v-for="report in reports" :key="report.id">
              <td>{{ report.examName }}</td>
              <td>{{ report.code }}</td>
              <td>{{ report.numOfParticipant }}</td>
              <td><button class="btn" @click="showModal = true">View</button></td>
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
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="showModal = !showModal"></button>
          </div>
          <div class="student-list">
            <div class="student-report" style="cursor: pointer;" @click="isFolding(-1)">
              <!-- visible content -->
              <div class="d-flex w-100">
                <div class="me-auto">
                  <h3>Nico</h3>
                  <p>Score: 21/30</p>
                </div>
              </div>
              <!-- hidden content -->
              <div class="d-flex w-100" v-if="-1 == isOpenIndex">
                <div class="me-3 text-center" width="50%">
                  <p class="percentage mx-2">12%</p>
                  <p class="cheating">Possibility of Cheating</p>
                </div>
                <div width="50%">
                  <div class="w-100 d-flex">
                    <div class="ms-auto me-2"><strong>Time Taken:</strong></div>
                    <div> 26 mins</div>
                  </div>
                  <table class="table table-striped table-hover mouse-data">
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
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Frequency</td>
                        <td>2</td>
                        <td>2</td>
                        <td>1</td>
                        <td>0</td>
                        <td>101</td>
                        <td>56</td>
                        <td>35</td>
                      </tr>
                      <tr>
                        <td>Average Frequency of Non-Cheating Students</td>
                        <td>2</td>
                        <td>2</td>
                        <td>3</td>
                        <td>5</td>
                        <td>75</td>
                        <td>50</td>
                        <td>85</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="student-report" v-for="(student, index) in students" :key="student.id" style="cursor: pointer;" @click="isFolding(index)">
              <!-- visible content -->
              <div class="d-flex w-100">
                <div class="me-auto">
                  <h3>{{ student.full_name }}</h3>
                  <p>Score: {{ student.score }}/{{ student.total_items }}</p>
                </div>
                <div v-show="is_cheating=true">
                  <h3><strong>Cheating Detected!</strong></h3>
                </div>
              </div>
              <!-- hidden content -->
              <div class="d-flex w-100" v-if="index == isOpenIndex">
                <div class="me-3 text-center" width="50%">
                  <p class="percentage mx-2">{{ student.mouse_data.percentage }}</p>
                  <p class="cheating">Possibility of Cheating</p>
                </div>
                <div width="50%">
                  <div class="w-100 d-flex">
                    <div class="ms-auto me-2"><strong>Time Taken:</strong></div>
                    <div> 26 mins</div>
                  </div>
                  <table class="table table-striped table-hover mouse-data">
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
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Frequency</td>
                        <td>{{ student.mouse_data.focus }}</td>
                        <td>{{ student.mouse_data.blur }}</td>
                        <td>{{ student.mouse_data.copy }}</td>
                        <td>{{ student.mouse_data.paste }}</td>
                        <td>{{ student.mouse_data.left_click }}</td>
                        <td>{{ student.mouse_data.right_click }}</td>
                        <td>{{ student.mouse_data.double_click }}</td>
                      </tr>
                      <tr>
                        <td>Average Frequency of Non-Cheating Students</td>
                        <td>{{ reports[1].average_mouse_data.focus }}</td>
                        <td>{{ reports[1].average_mouse_data.blur }}</td>
                        <td>{{ reports[1].average_mouse_data.copy }}</td>
                        <td>{{ reports[1].average_mouse_data.paste }}</td>
                        <td>{{ reports[1].average_mouse_data.left_click }}</td>
                        <td>{{ reports[1].average_mouse_data.right_click }}</td>
                        <td>{{ reports[1].average_mouse_data.double_click }}</td>
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

    <!-- modal -->
    <!-- <teleport to="#app">
      <div>
        <transition name="fade" appear>
          <div class="modal-overlay" v-if="showModal" @click="showModal = false"></div>
        </transition>
        <transition name="slide">
          <div class="modal-container">
            <h1>Lorem Ipsum</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex velit veniam cupiditate at maiores doloremque laboriosam neque perspiciatis quis mollitia.</p>
            <button class="btn" v-if="showModal" @click="showModal = false">close</button>
          </div>
        </transition>
      </div>
    </teleport> -->
      <!-- <div>
          <div class="modal-overlay">
            <div class="modal">
              <h1>Exam #1 Report</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex velit veniam cupiditate at maiores doloremque laboriosam neque perspiciatis quis mollitia.</p>
              <button class="btn">close</button>
            </div>
          </div>

          
      </div> -->
    

  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      isOpen: -2,
      reports: [
        {
          examName: 'Quiz #1',
          code: '12JDG46E',
          numOfParticipant: 20,
          id: 1,
          average_mouse_data: {
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 5,
            left_click: 75,
            right_click: 50,
            double_click: 85
          }
        },
        {
          examName: 'Quiz #2',
          code: '2S4AG7TG',
          numOfParticipant: 15,
          id: 2,
          average_mouse_data: {
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 5,
            left_click: 75,
            right_click: 50,
            double_click: 85
          }
        },
        {
          examName: 'Quiz #3',
          code: '1L4JG85H',
          numOfParticipant: 30,
          id: 3,
          average_mouse_data: {
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 5,
            left_click: 75,
            right_click: 50,
            double_click: 85
          }
        },
        {
          examName: 'Quiz #4',
          code: '0GKTU8S6',
          numOfParticipant: 36,
          id: 4,
          average_mouse_data: {
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 5,
            left_click: 75,
            right_click: 50,
            double_click: 85
          }
        },
        {
          examName: 'Quiz #5',
          code: '12JDG46E',
          numOfParticipant: 40,
          id: 5,
          average_mouse_data: {
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 5,
            left_click: 75,
            right_click: 50,
            double_click: 85
          }
        },
        {
          examName: 'Quiz #6',
          code: '0GHT6ED6',
          numOfParticipant: 16,
          id: 6,
          average_mouse_data: {
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 5,
            left_click: 75,
            right_click: 50,
            double_click: 85
          }
        },
        {
          examName: 'Quiz #7',
          code: 'S9A7D5A2D',
          numOfParticipant: 10,
          id: 7,
          average_mouse_data: {
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 5,
            left_click: 75,
            right_click: 50,
            double_click: 85
          }
        },
        {
          examName: 'Quiz #8',
          code: '0GHT87DR',
          numOfParticipant: 45,
          id: 8,
          average_mouse_data: {
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 5,
            left_click: 75,
            right_click: 50,
            double_click: 85
          }
        },
        {
          examName: 'Quiz #9',
          code: '0GHT6ED6',
          numOfParticipant: 16,
          id: 9,
          average_mouse_data: {
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 5,
            left_click: 75,
            right_click: 50,
            double_click: 85
          }
        },
        {
          examName: 'Quiz #10',
          code: '0GHT6ED6',
          numOfParticipant: 16,
          id: 10,
          average_mouse_data: {
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 5,
            left_click: 75,
            right_click: 50,
            double_click: 85
          }
        },
        {
          examName: 'Quiz #11',
          code: '0GHT6ED6',
          numOfParticipant: 16,
          id: 11,
          average_mouse_data: {
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 5,
            left_click: 75,
            right_click: 50,
            double_click: 85
          }
        },
        {
          examName: 'Quiz #12',
          code: '0GHT6ED6',
          numOfParticipant: 16,
          id: 12,
          average_mouse_data: {
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 5,
            left_click: 75,
            right_click: 50,
            double_click: 85
          }
        },
        {
          examName: 'Quiz #13',
          code: '0GHT6ED6',
          numOfParticipant: 16,
          id: 13,
          average_mouse_data: {
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 5,
            left_click: 75,
            right_click: 50,
            double_click: 85
          }
        }
      ],
      students: [
        {
          full_name: 'Maria',
          score: '24',
          total_items: '30',
          is_cheating: true,
          mouse_data: {
            percentage: '85%',
            focus: 25,
            blur: 25,
            copy: 12,
            paste: 11,
            left_click: 259,
            right_click: 195,
            double_click: 280
          }
        },
        {
          full_name: 'Pedro',
          score: '25',
          total_items: '30',
          is_cheating: true,
          mouse_data: {
            percentage: '75%',
            focus: 19,
            blur: 19,
            copy: 4,
            paste: 3,
            left_click: 208,
            right_click: 168,
            double_click: 106
          }
        },
        {
          full_name: 'Simon',
          score: '20',
          total_items: '30',
          is_cheating: false,
          mouse_data: {
            percentage: '35%',
            focus: 2,
            blur: 2,
            copy: 4,
            paste: 1,
            left_click: 156,
            right_click: 89,
            double_click: 67
          }
        },
        {
          full_name: 'Nena',
          score: '19',
          total_items: '30',
          is_cheating: false,
          mouse_data: {
            percentage: '20%',
            focus: 2,
            blur: 2,
            copy: 3,
            paste: 3,
            left_click: 89,
            right_click: 56,
            double_click: 67
          }
        },
        {
          full_name: 'Juan',
          score: '29',
          total_items: '30',
          is_cheating: true,
          mouse_data: {
            percentage: '88%',
            focus: 34,
            blur: 34,
            copy: 12,
            paste: 11,
            left_click: 230,
            right_click: 200,
            double_click: 280
          }
        },
        {
          full_name: 'Anna',
          score: '30',
          total_items: '30',
          is_cheating: true,
          mouse_data: {
            percentage: '78%',
            focus: 19,
            blur: 19,
            copy: 4,
            paste: 6,
            left_click: 198,
            right_click: 123,
            double_click: 99
          }
        },
      ]
    }
  },
  computed: {
    isOpenIndex() {
      console.log(this.isOpen)
      return this.isOpen
    }
  },
  methods: {
    isFolding(index) {
      this.isOpen = index
      console.log(this.isOpen)
    }
  }
}
</script>

<style>
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
  height: 72%;
  max-height: 72%;
}

.table-wrapper {
  padding-right: 5px;
  max-height: 100%;
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
  background-color: #3d3657 !important;
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