<template>
  <div>
    <h1>Reports</h1>
    <!-- <button @click="test">test</button> -->
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
              <td><button class="btn btn-main" @click="showModal = true">View</button></td>
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

          

          <div class="report-modal-container d-flex">
            <!-- <div class="left-container">
              <div class="me-3 text-center">
                <p class="percentage mx-2">24</p>
                <p class="cheating">out of <strong>30</strong> average score</p>
              </div>
            </div> -->

            <div class="right-container">
              <div class="d-flex">
                <div>
                  <p><strong>Examiner:</strong> Juan dela Cruz</p>
                  <p><strong>Subject:</strong> Science</p>
                </div>
                <div style="margin-left: 300px;">
                  <p><strong>Average Score:</strong> 24/30</p>
                  <p><strong>Date Created:</strong> 05/06/2022</p>
                </div>
              </div>

              
              <div class="table-wrapper2">
                <table class="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Score</th>
                      <th>Date Taken</th>
                      <th>Time (mins)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(student, index) in students" :key="index">
                      <td>{{ student.full_name }}</td>
                      <td>{{ student.score }}</td>
                      <td>{{ student.date }}</td>
                      <td>{{ student.time }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button class="btn btn-main ms-auto" style="float:right;">Export as Excel File</button>
            </div>

          </div>
        </div>
      </div>
    </teleport>

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
          date: '05/07/2022',
          time: '30',
        },
        {
          full_name: 'Pedro',
          score: '25',
          total_items: '30',
          date: '05/07/2022',
          time: '20',
        },
        {
          full_name: 'Simon',
          score: '20',
          total_items: '30',
          date: '05/08/2022',
          time: '32',
        },
        {
          full_name: 'Nena',
          score: '19',
          total_items: '30',
          date: '05/07/2022',
          time: '28',
        },
        {
          full_name: 'Juan',
          score: '29',
          total_items: '30',
          date: '05/07/2022',
          time: '33',
        },
        {
          full_name: 'Anna',
          score: '30',
          total_items: '30',
          date: '05/06/2022',
          time: '25',
        },
        {
          full_name: 'Ryan',
          score: '28',
          total_items: '30',
          date: '05/06/2022',
          time: '25',
        },
        {
          full_name: 'Lyn',
          score: '30',
          total_items: '30',
          date: '05/06/2022',
          time: '25',
        },        {
          full_name: 'Meg',
          score: '20',
          total_items: '30',
          date: '05/06/2022',
          time: '21',
        },
        {
          full_name: 'Anna',
          score: '30',
          total_items: '30',
          date: '05/06/2022',
          time: '25',
        },
        {
          full_name: 'Anna',
          score: '30',
          total_items: '30',
          date: '05/06/2022',
          time: '25',
        },
        {
          full_name: 'Anna',
          score: '30',
          total_items: '30',
          date: '05/06/2022',
          time: '25',
        },
        {
          full_name: 'Anna',
          score: '30',
          total_items: '30',
          date: '05/06/2022',
          time: '25',
        },
        {
          full_name: 'Anna',
          score: '30',
          total_items: '30',
          date: '05/06/2022',
          time: '25',
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
    async test() {
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
        console.log(data);
      } catch(e) {
        console.log(e);
      }
    },
    isFolding(index) {
      this.isOpen = index
      console.log(this.isOpen)
    }
  }
}
</script>

<style>
.modal-container {
  width: 75% !important;
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

.left-container {
  height: 100%;
  margin: 0 40px;
}

.table-wrapper {
  padding-right: 5px;
  max-height: 100%;
  overflow: auto;
}

.table-wrapper2 {
  margin-top: 10px;
  padding-right: 5px;
  max-height: 78%;
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