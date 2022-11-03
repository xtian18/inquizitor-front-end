import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LogIn from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import Dashboard from '../views/Dashboard.vue'
import TakeExam from '../views/TakeExam.vue'
import Activities from '../views/Activities.vue'
import MyExams from '../views/MyExams.vue'
import UpdateQuiz from '../views/UpdateQuiz.vue'
import Reports from '../views/Reports.vue'
import QuizTemplate from '../views/QuizTemplate.vue'
import QuizResult from '../views/QuizResult.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        alias: '/'
      },
      {
        path: '/take-quiz',
        name: 'Take Quiz',
        component: TakeExam
      },
      {
        path: '/take-quiz/:id',
        name: 'Quiz',
        component: QuizTemplate
      },
      {
        path: '/take-quiz/:id/result',
        name: 'Quiz Result ',
        component: QuizResult,
      },
      {
        path: '/activities/:id',
        name: 'Quiz Result',
        component: QuizResult,
      },
      {
        path: '/activities',
        name: 'Activities',
        component: Activities
      },
      {
        path: '/my-quizzes',
        name: 'My Quizzes',
        component: MyExams,
      },
      {
        path: '/my-quizzes/:id',
        name: 'Update Quiz',
        component: UpdateQuiz,
      },
      {
        path: '/reports',
        name: 'Reports',
        component: Reports
      }
    ]
  },
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active'
})

router.beforeEach((to, from) => {
  let documentTitle = to.name
  if (to.params.title) {
    documentTitle += ` | ${to.params.title}`
  } 
  document.title = documentTitle
})

export default router
