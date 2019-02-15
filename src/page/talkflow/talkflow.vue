<template>
  	<div :class="style.talkflow" v-loading="loading">
      <div :class="style.filter" class="filter_block">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="5">
              <el-form-item label="话术名称：">
                <el-input v-model="formInline.termName" placeholder="输入任务名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="创建人：">
                <el-input v-model="formInline.operName" placeholder="输入创建人"></el-input>
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
            <el-col :span="5">
              <el-form-item label="状态：">
                <el-select clearable v-model="formInline.verifyStatus" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in stateMap"
                    :key="item"
                    :label="item"
                    :value="index+1">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row type="flex" class="row-bg filter_but" justify="space-around">
          <el-button type="primary" @click="queryTalk">查询</el-button>
        </el-row>
      </div>

      <!-- 新增话术按钮 -->
      <div :class="style.control_button">
        <el-button type="primary" plain @click="addTalk">+新增话术</el-button>
      </div>

      <!-- 表格 -->
      <div :class="style.data_table">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column label="话术名称" width='300'>
            <template slot-scope="scope">
              <router-link :class="style.rlink" :to="`/talkflow/talkflow_detail/${scope.row.seqId}/${scope.row.termName}`">{{scope.row.termName}}</router-link>
            </template>
          </el-table-column>
          <el-table-column :width="index == 3 || index == 4 ? '150':''" v-for="(item,index) in tableHead"
            :prop="item.prop"
            :label="item.label">
          </el-table-column>
          <el-table-column label="操作" width='300'>
            <template slot-scope="scope">
              <span :class="style.table_operate_but" @click="handleEdit(scope.$index, scope.row)"></span>
              <span :class="style.table_operate_but" @click="handleCopy(scope.$index, scope.row)"></span>
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
      <el-dialog title="新增话术" :visible.sync="dialogFormVisible" close-on-click-modal modal center :class="style.dialog">
        <el-form :model="talkForm" label-width="100px">
          <el-form-item label="话术名称：" >
            <el-input v-model="talkForm.termName" autocomplete="off" placeholder="输入话术名称"></el-input>
          </el-form-item>
          <el-form-item label="话术描述：" >
            <el-input
              type="textarea"
              autosize
              placeholder="输入话术描述"
              v-model="talkForm.termDesc"
              :class="style.textarea"
              :autosize="{ minRows: 2}">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveTalk">保 存</el-button>
        </div>
      </el-dialog>

      <!-- 审核话术 -->
      <el-dialog title="审核话术" :visible.sync="dialogAudit" close-on-click-modal modal center :class="style.dialog">
        <el-form label-width="100px">
          <el-form-item label="状态：" >
            <el-select v-model="talkAuditToChange" placeholder="请选择">
              <el-option
                v-for="(item, index) in stateMap"
                :key="item"
                :label="item"
                :value="index+1">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAudit = false">取 消</el-button>
          <el-button type="primary" @click="saveTalkStatus">保 存</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import style from './talkflow.less'
import ajax from 'src/config/acrajax'
export default {
  name: 'talkflow',
  data(){
    return {
      style,
      formInline:{
        termName:"",
        operName:"",
        beginTime:"",
        endTime:"",
        verifyStatus:''
      },
      currentPage:1,
      tableHead:[{label:'创建人',prop:'operName'},{label:'创建时间',prop:'createTime'},{label:'状态',prop:'verifyStatus'},{label:'备注',prop:'REMARK'}],
      stateMap:['审核中','可用','失效','审核不通过'],
      talkList:[

      ],
      loading: false,
      dialogFormVisible:false,
      talkForm:{
        termName:'',
        termDesc:'',
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
      let temp = this.talkList.map((item)=>{
        return {...item, verifyStatus:this.stateMap[item.verifyStatus - 1]}
      })
      return temp
    },
    formAdjust() {
      let temp = {...this.formInline}
      if(!temp.beginTime)
      temp.beginTime = ""
      if(!temp.endTime)
      temp.endTime = ""
      temp.verifyStatus = ''+temp.verifyStatus
      return temp
    }
  },
  updated() {
  },
  created(){
    this.getAndSetTalkListByPage(1)
    this.$store.commit({
      type: 'CHANGE_FIRST_PATH',
      firstPath: '话术配置',
      url:'/talkflow'
    })
  },
  methods:{
    async queryTalk() {
      await this.getAndSetTalkListByPage(1)


      this.talkList = JSON.parse(JSON.stringify(talkList))
    },
    async addTalk() {
      this.resetTalkForm(false)
      this.dialogFormVisible = true
    },
    async saveTalkStatus() {
      this.loading = true
      await ajax('POST','updateTermStatus',{ seqId: ''+this.talkSeleted.seqId, verifyStatus: ''+this.talkAuditToChange }, false)
      this.loading = false
      this.alertMsg('s','修改状态成功！')
      this.dialogAudit =  false

      this.talkList = this.talkList.map((item)=>{
        if(item.seqId == this.talkSeleted.seqId) {
          return {...item, verifyStatus:this.talkAuditToChange}
        } else {
          return {...item}
        }
      })
    },
    handleEdit(index, row) {
      this.talkForm = {
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
      await this.getAndSetTalkListByPage(value)
      this.loading = false
    },
    async saveTalk() {
      this.dialogFormVisible = false
      this.loading = true
      if (!this.talkForm.isEdit) {
        await ajax('POST', 'newTerm', {...this.talkForm,operId:'lijm', verifyStatus:'1', remark:'专用'}, false)
        this.getAndSetTalkListByPage(1)
      } else {
        const {termName, termDesc, REMARK, seqId} = this.talkForm
        await ajax('POST', 'updateTerm', {termName, termDesc, REMARK, seqId}, false)
        this.talkList = this.talkList.map((item)=>{
          if(item.seqId == this.talkForm.seqId) {
            return {...this.talkForm}
          } else {
            return {...item}
          }
        })
      }
      this.loading = false
      this.alertMsg('s','话术保存成功！')
    },
    resetTalkForm(isEdit) {
      let temp = {...this.talkForm}
      for(let x in temp) {
        temp[x] = ""
      }
      temp.isEdit = isEdit
      this.talkForm = temp
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
      this.getAndSetTalkListByPage(page)
    },
    async getAndSetTalkListByPage(page) {
      this.loading = true
      const data = ( await ajax('POST', 'viewTerm', {...this.formAdjust, pageNum:''+page}) ).page
      this.loading = false

      // this.loading = true
      // const talkList = ( await ajax('POST', 'viewTerm', {pageNum:''+page}) ).page.list
      // this.loading = false

      this.totalPage = data.pages
      this.currentPage = page
      this.talkList = JSON.parse(JSON.stringify(data.list))
    }
  }
}
</script>
