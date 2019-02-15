<template>
  <div :class="style.leftnav">
    <div :class="[style.nav_head, isCollapse?style.collapse:'']"  :style="{textAlign:'right'}">
    </div>
    <span :class="style.nav_collapse" @click="toggleMenu"></span>

    <el-menu :default-active="$route.path" :style="{marginTop:'16px'}" class="el-menu-vertical-demo" :collapse="isCollapse" router background-color="transparent" text-color="white" active-text-color="white" active-background-color="#1522a1">
      <el-menu-item index="/aitask">
        <i class="el-icon-ai"></i>
        <span slot="title">AI外呼任务</span>
      </el-menu-item>

      <el-menu-item index='/talkflow'>
        <i class="el-icon-talk"></i>
        <span slot="title">话术配置</span>
      </el-menu-item>


    </el-menu>
  </div>
</template>

<script>
import style from './leftnav.less'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      style
    };
  },
  computed: mapState({
    isCollapse: state => state.isCollapse
  }),
  methods: {
    toggleMenu() {
      this.$store.commit({
        type: 'NAV_COLLAPSE'
      })
    }
  }
}
</script>
