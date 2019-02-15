<template>
	<div :style="{height:'100%'}">
		<headerView></headerView>
		<leftnav></leftnav>
  	<div class="content_page" :class="isCollapse ? 'is_collapse':'' ">
			<transition name="slide-fade">
				<router-view></router-view>
			</transition>
		</div>
		<footerView></footerView>
  </div>
</template>

<script>
	import leftnav from './components/leftnav/leftnav'
	import headerView from './components/header/header'
	import footerView from './components/footer/footer'
	import { mapState } from 'vuex'

	export default {
		components:{
			leftnav,
			headerView,
			footerView,
		},
		computed: mapState({
			isCollapse : state => state.isCollapse
		})
	}
</script>
