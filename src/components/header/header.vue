
<template>
    <div :class="[style.header, isCollapse?style.collapse:'']">
      <el-breadcrumb separator-class="el-icon-arrow-right" :style="{display:'inline-block'}">
        <el-breadcrumb-item :to="{ path: firstUrl }">{{firstPath}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: secondUrl }" v-if="secondPath">{{secondPath}}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="thirdPath">{{thirdPath}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>

<script>
import style from './header.less'
import { mapState } from 'vuex'

export default {
	name: 'headerView',
  data: ()=> (
    {
      style,
      userName:'默认用户名'
    }
  ),
  computed: mapState({
    // 箭头函数可使代码更简练
    firstPath: state => state.firstPath,
    firstUrl: state=>state.firstUrl,
    secondPath: state=> state.secondPath,
    secondUrl: state=>state.secondUrl,
    thirdPath: state=> state.thirdPath,
    isCollapse: state => state.isCollapse
  }),
	created(){

	},
  methods: {

  }
}
</script>
