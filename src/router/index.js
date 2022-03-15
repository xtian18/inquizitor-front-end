import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LogIn from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import Dashboard from '../views/Dashboard.vue'
import TakeExam from '../views/TakeExam.vue'
import Activities from '../views/Activities.vue'
import UpdateProfile from '../views/UpdateProfile.vue'
import MyExams from '../views/MyExams.vue'
import Reports from '../views/Reports.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: '/take-exam',
        name: 'TakeExam',
        component: TakeExam
      },
      {
        path: '/activities',
        name: 'Activities',
        component: Activities
      },
      {
        path: '/update-profile',
        name: 'UpdateProfile',
        component: UpdateProfile
      },
      {
        path: '/my-exams',
        name: 'MyExams',
        component: MyExams
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
  linkActiveClass: 'active'
})

export default router
