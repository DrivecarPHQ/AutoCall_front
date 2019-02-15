<template>
  	<div :class="style.aitask" v-loading="loading">
      <test></test>
      <div :class="style.filter" class="filter_block">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="5">
              <el-form-item label="任务名称：">
                <el-input v-model="formInline.taskName" placeholder="输入任务名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="创建人：">
                <el-input v-model="formInline.operName" placeholder="输入创建人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="话术名称：">
                <el-input v-model="formInline.termName" placeholder="输入话术名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
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
        <el-button type="primary" plain @click="addTask">+新增活动</el-button>
      </div>

      <!-- 表格 -->
      <div :class="style.data_table">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column label="任务名称" width='170'>
            <template slot-scope="scope">
              <router-link :class="style.rlink" :to="`/aitask/aitask_detail/${scope.row.seqId}/${scope.row.taskName}`">{{scope.row.taskName}}</router-link>
            </template>
          </el-table-column>
          <template v-for="(item,index) in tableHead">
            <!-- <el-table-column :width="100" v-if="index == 0 || index == 4 || index == 5"
              :prop="item.prop"
              :label="item.label">
            </el-table-column> -->
            <el-table-column :width="190" v-if="index == 1"
              :prop="item.prop"
              :label="item.label">
            </el-table-column>
            <el-table-column v-else
              :prop="item.prop"
              :label="item.label">
            </el-table-column>
          </template>
          <el-table-column label="操作" width='240'>
            <template slot-scope="scope">
              <span :class="style.table_operate_but" @click="handleEdit(scope.$index, scope.row)"></span>
              <span :class="style.table_operate_but" @click="handleAudit(scope.$index, scope.row)"></span>
              <span :class="style.table_operate_but" @click="handleDelete(scope.$index, scope.row)"></span>
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


      <!-- 新增话术 -->
      <el-dialog title="新增活动" :visible.sync="dialogFormVisible" close-on-click-modal modal center :class="style.dialog">
        <el-form :model="taskForm" label-width="100px">
          <el-form-item label="话术名称：" >
            <el-input v-model="taskForm.taskName" autocomplete="off" placeholder="输入活动名称"></el-input>
          </el-form-item>
          <el-form-item label="活动描述：" >
            <el-input
              type="textarea"
              autosize
              placeholder="输入活动描述"
              v-model="taskForm.taskDesc"
              :class="style.textarea"
              :autosize="{ minRows: 2}">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveTask">保 存</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import style from './aitask.less'
import ajax from 'src/config/acrajax'
export default {
  name: 'aitask',
  data(){
    return {
      style,
      formInline:{
        taskName:"",
        operName:"",
        termName:"",
        beginTime:"",
        endTime:""
      },
      currentPage:1,
      tableHead:[
        {label:'任务数量',prop:'taskAmount'},
        {label:'创建时间',prop:'createTime'},
        {label:'创建人',prop:'operName'},
        {label:'选择话术',prop:'termName'},
        {label:'活动状态',prop:'taskStatus'},
        {label:'完成比例',prop:'taskRatio'},
        {label:'A/B级意向用户数',prop:'attendUserNum'}
      ],
      statusMap:['待审核','进行中','暂停','已结束'],
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
      let temp = this.taskList.map((item)=>{
        return {...item, taskStatus:this.statusMap[item.taskStatus - 1]}
      })
      return temp
    },
    formAdjust() {
      let temp = {...this.formInline}
      if(!temp.beginTime)
      temp.beginTime = ""
      if(!temp.endTime)
      temp.endTime = ""
      temp.taskStatus = ''+temp.taskStatus
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
    this.getAndSetTaskListByPage(1)
  },
  methods:{
    async queryTask() {
      await this.getAndSetTaskListByPage(1)


      this.talkList = JSON.parse(JSON.stringify(talkList))
    },
    async addTask() {
      this.resettaskForm(false)
      this.dialogFormVisible = true
    },
    handleEdit(index, row) {
      this.taskForm = {
        ...row,
        isEdit:true
      }
      this.dialogFormVisible = true
    },
    async handleDelete(index, row) {
      this.$confirm('确定删除话术？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.loading = true
        await ajax('POST', 'delTerm', { seqId: ''+row.seqId }, false)
        this.loading = false
        this.alertMsg('s','话术删除成功')
        this.talkList = this.talkList.filter((item)=>{
          return item.seqId != row.seqId
        })
      }).catch(() => {
      });


    },
    handleCopy(index, row) {
      console.log('row',row)
      console.log('i',index)
    },
    handleAudit(index, row) {
      this.dialogAudit = true
      this.talkSeleted = {...row}
      this.talkAuditToChange = row.verifyStatus
    },
    async handleCurrentChange(value) {
      this.loading = true
      await this.getAndSetTaskListByPage(value)
      this.loading = false
    },
    async saveTask() {
      this.dialogFormVisible = false
      this.loading = true
      if (!this.taskForm.isEdit) {
        await ajax('POST', 'newTerm', {...this.taskForm,operId:'lijm', verifyStatus:'1', remark:'专用'}, false)
        this.getAndSetTaskListByPage(1)
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
      this.getAndSetTaskListByPage(page)
    },
    async getAndSetTaskListByPage(page) {
      // this.loading = true
      // const data = ( await ajax('POST', 'viewTerm', {...this.formAdjust, pageNum:''+page}) ).page
      // this.loading = false

      const data = {
        list:[
          {
            seqId:1,
            taskName:'1月地产开会营销',
            taskAmount:300,
            createTime:'2018-01-01 10:12:45',
            operName:'施主请自重',
            termName:'地产营销话术',
            taskStatus:1,
            taskRatio:'80%',
            attendUserNum:35644
          },
          {
            seqId:2,
            taskName:'1月地产开会营销',
            taskAmount:300,
            createTime:'2018-01-01 10:12:45',
            operName:'施主请自重',
            termName:'地产营销话术',
            taskStatus:1,
            taskRatio:'80%',
            attendUserNum:35644
          },
          {
            seqId:3,
            taskName:'1月地产开会营销',
            taskAmount:300,
            createTime:'2018-01-01 10:12:45',
            operName:'施主请自重',
            termName:'地产营销话术',
            taskStatus:1,
            taskRatio:'80%',
            attendUserNum:35644
          }
        ],
        pages:1
      }

      // this.loading = true
      // const talkList = ( await ajax('POST', 'viewTerm', {pageNum:''+page}) ).page.list
      // this.loading = false

      this.totalPage = data.pages
      this.currentPage = page
      this.taskList = JSON.parse(JSON.stringify(data.list))
    }
  }
}
</script>
