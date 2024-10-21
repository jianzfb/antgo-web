import Vue from 'vue'
import Router from 'vue-router'
const Project = ()=>import('@/components/Project')
const Label = ()=>import('@/components/Label')
const Login = ()=>import('@/components/Login')
const Welcome = ()=>import('@/components/Welcome')
const Browser = ()=>import('@/components/Browser')
const Predict = ()=>import('@/components/Predict')
const Demo = ()=>import('@/components/Demo')
Vue.use(Router)


export default new Router({
    base: "/{DEMONAME}/",
    mode: "hash",
    routes: [
      {
        path: '/',
        name: 'Welcome',
        component: Welcome
      },        
      {
        path: '/projects',
        name: 'Project',
        component: Project
      },
      {
        path: '/project/:id?',
        name: 'Label',
        component: Label
      },
      {
        path: '/login',
        name: 'Login',
        component: Login
      },    
      {
        path: '/browser',
        name: 'Browser',
        component: Browser
      },  
      {
        path: '/predict',
        name: 'Predict',
        component: Predict
      },
      {
        path: '/demo/:name?',
        name: 'Demo',
        component: Demo
      }
    ]
  })
  