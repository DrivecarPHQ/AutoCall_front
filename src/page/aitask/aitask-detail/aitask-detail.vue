<template>
  	<div :class="style.aitask_detail" v-loading="loading">
      <div :class="style.filter" class="filter_block">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="4">
              <el-form-item label="姓名：">
                <el-input v-model="formInline.userName" placeholder="输入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="拨打次数：">
                <el-input v-model="formInline.dailAmount" placeholder="输入拨打次数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="意向等级：">
                <el-select clearable v-model="formInline.attendRange" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in attendRangeMap"
                    :key="item"
                    :label="item"
                    :value="index+1">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="拨打状态：">
                <el-select clearable v-model="formInline.dailStatus" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in dailStatusMap"
                    :key="item"
                    :label="item"
                    :value="index+1">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="创建时间：">
                <el-date-picker
                  v-model="formInline.beginTime"
                  align="right"
                  type="date"
                  placeholder="开始时间"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-date-picker
                  v-model="formInline.endTime"
                  align="right"
                  type="date"
                  placeholder="结束时间"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row type="flex" class="row-bg filter_but" justify="space-around">
          <el-button type="primary" @click="queryTask">查询</el-button>
        </el-row>
      </div>

      <!-- 新增话术按钮 -->
      <div :class="style.control_button">
        <el-button type="success" @click="startAi">开始AI外呼</el-button>
        <el-button type="danger" @click="endAi">停止AI外呼</el-button>
      </div>

      <!-- 表格 -->
      <div :class="style.data_table">
        <el-table
          :data="tableData"
          style="width: 100%">
          <template v-for="(item,index) in tableHead">
            <el-table-column :width="180" v-if="index == 2"
              :prop="item.prop"
              :label="item.label">
            </el-table-column>
            <el-table-column v-else
              :prop="item.prop"
              :label="item.label">
            </el-table-column>
          </template>
          <el-table-column label="操作" width='100'>
            <template slot-scope="scope">

              <router-link :class="style.rlink" :to="`/chat/${scope.row.seqId}/${scope.row.userName}`">
                <span :class="style.table_operate_but" @click="handleDetail(scope.$index, scope.row)"></span>
              </router-link>
            </template>
          </el-table-column>
        </el-table>

        <div :class="style.pagination">
          <span :class="style.pagination_first" @click="pageFirstAndLast('first')">首页</span>
          <el-pagination
            layout="prev, pager, next"
            :page-count="totalPage"
            @current-change="handleCurrentChange"
            :current-page="currentPage">
          </el-pagination>
          <span :class="style.pagination_last" @click="pageFirstAndLast('last')">尾页</span>
        </div>
      </div>
    </div>
</template>

<script>
import style from './aitask-detail.less'
import ajax from 'src/config/acrajax'
export default {
  name: 'aitask-detail',
  data(){
    return {
      style,
      formInline:{
        userName:"",
        dailAmount:"",
        attendRange:"",
        dailStatus:"",
        beginTime:"",
        endTime:""
      },
      currentPage:1,
      tableHead:[
        {label:'姓名',prop:'userName'},
        {label:'电话号码',prop:'phoneNum'},
        {label:'拨打时间',prop:'dailTime'},
        {label:'负责人',prop:'operName'},
        {label:'活动话术',prop:'termName'},
        {label:'拨打状态',prop:'dailStatus'},
        {label:'通话轮数',prop:'dailRound'},
        {label:'通话轮数',prop:'attendRange'}
      ],
      attendRangeMap:['A级','B级','C级','D级','E级'],
      dailStatusMap:['未拨打','已拨打'],
      talkList:[

      ],
      loading: false,
      dialogFormVisible:false,
      taskForm:{
        termName:'',
        taskDesc:'',
        isEdit:false
      },
      talkAuditToChange:'',
      dialogAudit:false,
      talkSeleted:'',
      totalPage:0
    }
  },
  computed: {
    tableData() {
      let temp = this.userList.map((item)=>{
        return {...item, dailStatus:this.dailStatusMap[item.dailStatus - 1], attendRange:this.attendRangeMap[item.attendRange - 1]}
      })
      return temp
    },
    formAdjust() {
      let temp = {...this.formInline}
      if(!temp.beginTime)
      temp.beginTime = ""
      if(!temp.endTime)
      temp.endTime = ""
      temp.dailStatus = ''+temp.dailStatus
      temp.attendRange = ''+temp.attendRange
      return temp
    }
  },
  updated() {
  },
  created(){
    //设置面包屑一级路径
    this.$store.commit({
      type: 'CHANGE_FIRST_PATH',
      firstPath: 'AI外呼任务',
      url: '/aitask'
    })
    this.$store.commit({
      type: 'CHANGE_SECOND_PATH',
      secondPath: this.$route.params.taskName,
      url: this.$route.path
    })
    this.getAndSetUserListByPage(1)
  },
  methods:{
    async queryTask() {
      await this.getAndSetUserListByPage(1)


      this.talkList = JSON.parse(JSON.stringify(talkList))
    },
    async startAi() {
      console.log('start')
    },
    async endAi() {
      console.log('end')
    },
    handleDetail(index, row) {
      console.log(row)
    },
    async handleCurrentChange(value) {
      this.loading = true
      await this.getAndSetUserListByPage(value)
      this.loading = false
    },
    async saveTask() {
      this.dialogFormVisible = false
      this.loading = true
      if (!this.taskForm.isEdit) {
        await ajax('POST', 'newTerm', {...this.taskForm,operId:'lijm', verifyStatus:'1', remark:'专用'}, false)
        this.getAndSetUserListByPage(1)
      } else {
        const {termName, taskDesc, REMARK, seqId} = this.taskForm
        await ajax('POST', 'updateTerm', {termName, taskDesc, REMARK, seqId}, false)
        this.talkList = this.talkList.map((item)=>{
          if(item.seqId == this.taskForm.seqId) {
            return {...this.taskForm}
          } else {
            return {...item}
          }
        })
      }
      this.loading = false
      this.alertMsg('s','话术保存成功！')
    },
    resettaskForm(isEdit) {
      let temp = {...this.taskForm}
      for(let x in temp) {
        temp[x] = ""
      }
      temp.isEdit = isEdit
      this.taskForm = temp
    },
    alertMsg(type,message = '操作成功！') {
      if(type == 's') {
        this.$message({
          message,
          type: 'success'
        });
      } else {
        this.$message.error('系统繁忙');
      }
    },
    pageFirstAndLast(type) {
      let page
      if(type == 'first') {
        page=1
      } else {
        page=this.totalPage
      }
      this.getAndSetUserListByPage(page)
    },
    async getAndSetUserListByPage(page) {
      // this.loading = true
      // const data = ( await ajax('POST', 'viewTerm', {...this.formAdjust, pageNum:''+page}) ).page
      // this.loading = false

      const data = {
        list:[
          {
            seqId:1,
            userName:'张三',
            phoneNum:'139****2490',
            dailTime:'2018-01-01 10:12:45',
            operName:'施主请自重',
            termName:'地产营销话术',
            dailStatus:1,
            dailRound:3,
            attendRange:2
          },
          {
            seqId:2,
            userName:'张三',
            phoneNum:'139****2490',
            dailTime:'2018-01-01 10:12:45',
            operName:'施主请自重',
            termName:'地产营销话术',
            dailStatus:1,
            dailRound:3,
            attendRange:2
          },
          {
            seqId:3,
            userName:'张三',
            phoneNum:'139****2490',
            dailTime:'2018-01-01 10:12:45',
            operName:'施主请自重',
            termName:'地产营销话术',
            dailStatus:2,
            dailRound:3,
            attendRange:2
          }
        ],
        pages:1
      }

      // this.loading = true
      // const talkList = ( await ajax('POST', 'viewTerm', {pageNum:''+page}) ).page.list
      // this.loading = false

      this.totalPage = data.pages
      this.currentPage = page
      this.userList = JSON.parse(JSON.stringify(data.list))
    }
  }
}
</script>
