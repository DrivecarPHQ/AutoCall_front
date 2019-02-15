import Vue from 'vue'

import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'
import elementUI from 'element-ui'
import test from './page/test/test'
import conponent from './page/test/component'

import ajax from './config/ajax'

import './style/common'
import './style/nomalize'
// import './config/rem'

// import animated from 'animate.css'

Vue.use(elementUI)
Vue.use(VueRouter)
Vue.component(conponent)
// Vue.use(animated)

const router = new VueRouter({
	// history模式可以将/#/去掉
	// 但是需要服务器配置，因为可能服务器会将这个请求当作是请求资源
	// mode: 'history',
	routes
})

// new Vue({
// 	router,
// 	store,
// }).$mount('#app')


new Vue(test).$mount('#app')
