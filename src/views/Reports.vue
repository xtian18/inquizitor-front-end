<template>
  <div>
    <h1>Reports</h1>
    <div class="report-container">
      <div class="table-wrapper">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Exam Name</th>
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
              <td><button class="btn">View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
data() {
  return {
    reports: [
      {
        examName: 'Exam #1',
        code: '12JDG46E',
        numOfParticipant: 20,
        id: 1
      },
      {
        examName: 'Exam #2',
        code: '2S4AG7TG',
        numOfParticipant: 15,
        id: 2
      },
      {
        examName: 'Exam #3',
        code: '1L4JG85H',
        numOfParticipant: 30,
        id: 3
      },
      {
        examName: 'Exam #4',
        code: '0GKTU8S6',
        numOfParticipant: 36,
        id: 4
      },
      {
        examName: 'Exam #5',
        code: '12JDG46E',
        numOfParticipant: 40,
        id: 5
      },
      {
        examName: 'Exam #6',
        code: '0GHT6ED6',
        numOfParticipant: 16,
        id: 6
      },
      {
        examName: 'Exam #7',
        code: 'S9A7D5A2D',
        numOfParticipant: 10,
        id: 7
      },
      {
        examName: 'Exam #8',
        code: '0GHT87DR',
        numOfParticipant: 45,
        id: 8
      },
      {
        examName: 'Exam #6',
        code: '0GHT6ED6',
        numOfParticipant: 16,
        id: 6
      },
      {
        examName: 'Exam #6',
        code: '0GHT6ED6',
        numOfParticipant: 16,
        id: 6
      },
      {
        examName: 'Exam #6',
        code: '0GHT6ED6',
        numOfParticipant: 16,
        id: 6
      },
      {
        examName: 'Exam #6',
        code: '0GHT6ED6',
        numOfParticipant: 16,
        id: 6
      },
      {
        examName: 'Exam #6',
        code: '0GHT6ED6',
        numOfParticipant: 16,
        id: 6
      }
    ]
  }
}
}
</script>

<style>
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
</style>