<template>
  	<div :class="style.talkflow_detail" v-loading="loading">
      <div :class="style.publish_talkflow">
        <span :class="style.publish_button">发布话术</span>
      </div>
      <div :class="style.talkflow_control">
        <!-- 主体左边 -->
        <div :class="style.talkflow_control_left">
          <div :class="style.talkflow_buttons">
            <span :class="style.add_flow" @click="addNode">新增流程</span>
            <span :class="style.delete_flow" @click="deleteNode">删除</span>
          </div>

          <div :class="style.talkflow_list">
            <el-radio-group v-model="radio" @change="selectNode" :style="{width:'100%'}">
              <div v-for="flow in flowList">
                <el-radio :label="flow.seqId">
                  <span>{{flow.processName}}</span>
                </el-radio>
                <div :class="style.player" v-if="flow.fileName != ''">
                  <!-- <audio controls src="https://moeplayer.b0.upaiyun.com/aplayer/secretbase.mp3"></audio> -->

                  <aplayer
                  :music="{
                    title: flow.fileName,
                    artist:'～作者',
                    src: `/pbsacr/file/break_download?filePath=${flow.filePath}`,
                    pic: ''
                  }"
                  ref="player"/>
                </div>
              </div>
            </el-radio-group>
          </div>
        </div>
        <!-- 主体右边 -->
        <div :class="style.talkflow_control_right">
          <div :class="style.save_block">
            <span :class="style.save_button" @click="saveNode">保存</span>
          </div>
          <div :class="style.form">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="名称：" label-width="60px">
                <el-input v-model="form.processName" placeholder="流程名称"></el-input>
              </el-form-item>
              <el-form-item label="描述：" label-width="60px">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 6, maxRows: 8}"
                  placeholder="流程描述"
                  v-model="form.processDesc"></el-input>
              </el-form-item>
              <el-form-item label="录音：" label-width="60px">
                <div v-if="form.fileName != ''" :style="{fontSize:'16px'}">{{form.fileName}}</div>
                <el-upload
                  class="upload-demo"
                  action="/pbsacr/file/upload"
                  drag
                  multiple
                  :onSuccess="uploadSuccess"
                  >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">请上传音频文件</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="意图：" label-width="60px">
                <div :class="style.add_intention" @click="addIntention">添加</div>
              </el-form-item>
            </el-form>
          </div>
          <div :class="style.svg_add_intention">
            <svg-add-intention ref="svgchild" @intentionDetail="onIntentionDetail"></svg-add-intention>
          </div>
        </div>
      </div>

      <!-- 添加意图弹窗 -->
      <el-dialog title="添加意图" :visible.sync="dialogFormVisible" close-on-click-modal modal center :class="style.dialog">
        <el-form :model="intentionDetail" label-width="100px">
          <el-form-item label="意图名称：" >
            <el-input v-model="intentionDetail.twistName" autocomplete="off" placeholder="请输入意图名称"></el-input>
          </el-form-item>
          <el-form-item label="关键词：" >
            <el-input
              type="textarea"
              autosize
              placeholder="关键词用都好分割，例如：护肤品、化妆品"
              v-model="intentionDetail.keyWord"
              :class="style.textarea">
            </el-input>
          </el-form-item>
          <el-form-item label="" :style="{marginTop:'-20px'}" v-if="keyWords.length > 0 && keyWords[0] != ''">
            <el-button type="primary" plain size="small" v-for="item in keyWords">{{item}}</el-button>
          </el-form-item>
          <el-form-item label="话术跳转：">
            <el-select v-model="intentionDetail.nextProcessId" filterable placeholder="请选择下一个节点">
              <el-option
                v-for="item in flowList"
                :key="item.seqId"
                :label="item.processName"
                :value="item.seqId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveIntention">保 存</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import style from './talkflow-detail.less'
import svgAddIntention from './svg-add-intention/svg-add-intention'
import { mapState } from 'vuex'
import ajax from 'src/config/acrajax'
import Aplayer from 'vue-aplayer'

export default {
	name: 'talkflow-detail',
  components:{
    svgAddIntention,
    Aplayer
  },
  data() {
    return {
      style,
      radio:0,
      form:{
        processName:'',
        processDesc:'',
        fileName:'',
        filePath:''
      },
      nodeIdSelected:0,
      dialogFormVisible:false,
      intentionDetail:{
        twistName:'',
        keyWord:'',
        nextProcessId:0
      },
      loading:false
    }
  },
  computed : mapState({
    // 箭头函数可使代码更简练
    flowList: state => state.flowList,
    intention: state => state.intention,
    keyWords() {
      return this.intentionDetail.keyWord.split(/,|，/)
    }
  }),
  created(){
    this.initFlowList()
    this.$store.commit({
      type: 'CHANGE_FIRST_PATH',
      firstPath: '话术配置',
      url:'/talkflow'
    })
    this.$store.commit({
      type: 'CHANGE_SECOND_PATH',
      secondPath: this.$route.params.termName
    })
  },
  methods: {
    async selectNode(value) {
      const that = this
      this.flowList.forEach(function(item, index){
        if(item.seqId == value) {
          that.form = {...item}
          that.nodeSelected = {...item}
        }
      })

      //获取意图信息
      this.loading = true;
      const intention = ( await ajax('POST', 'queryTermTwist', {termProcessId:''+value})).data
      this.loading = false;

      that.$store.commit({
        type: 'SET_INTENTION',
        intention: JSON.parse(JSON.stringify(intention))
      })
    },
    async addNode() {
      //请求，拿回id
      this.loading = true;
      const addNode = await ajax('POST', 'newTermProcess', {termId:'999'}, false)
      this.loading = false;
      this.alertMsg('s','新增流程节点成功！')
      this.$store.commit({
        type: 'ADD_NODE',
        node: {
          seqId:addNode.seqId,
          processName:addNode.processName,
          processDesc:addNode.processDesc,
          fileName:'',
          filePath:''
        }
      })
      this.selectNode(addNode.seqId)
      this.radio = addNode.seqId
    },
    async deleteNode() {
      //请求，成功后前端去掉
      if (this.nodeSelected.processType == 1 || this.nodeSelected.processType == 3) {
        this.$message.error('不能删除开场白和结尾');
      } else {
        this.loading = true;
        // const addNode = await ajax('POST', 'delTermProcess', {seqId:''+this.nodeIdSelected}, false)
        const addNode = await ajax('POST', 'delTermProcess', {seqId:''+this.nodeSelected.seqId}, false)
        this.loading = false;
        this.alertMsg('s', '删除流程节点成功！')
        this.$store.commit({
          type: 'DELETE_NODE',
          // nodeIdSelected : this.nodeIdSelected
          nodeIdSelected : this.nodeSelected.seqId
        })
        this.selectNode(this.flowList[0].seqId)
        this.radio = this.flowList[0].seqId
      }

    },
    async saveNode() {
      this.loading = true;
      const addIntention = ( await ajax('POST', 'updateTermProcess', {...this.form, currentProcessId:this.nodeSelected.seqId}, false)).data
      this.loading = false;
      this.alertMsg('s', '保存流程信息成功！')

      this.$store.commit({
        type: 'EDIT_NODE',
        form: {...this.form},
        nodeIdSelected: this.nodeSelected.seqId
      })
    },
    addIntention() {
      this.intentionDetail = {
        twistName:'',
        keyWord:'',
        nextProcessId:this.flowList[0].seqId,
        isEdited:false
      }
      this.dialogFormVisible=true
    },
    async saveIntention() {
      const {twistName, keyWord, nextProcessId, isEdited, seqId} = this.intentionDetail
      const temp = {twistName, keyWord, nextProcessId}
      this.dialogFormVisible = false
      if(!isEdited) {
        //请求，拿回新增的ID
        this.loading = true;
        const addIntention = await ajax('POST', 'newTermTwist', {...temp, currentProcessId:this.nodeSelected.seqId}, false)
        this.loading = false;
        this.alertMsg('s', '新增意图成功！')

        this.$store.commit({
          type:'ADD_INTENTION',
          seqId:addIntention.seqId,
          ...temp
        })
      } else {
        this.loading = true;
        const addIntention = await ajax('POST', 'updateTermTwist', {...temp, seqId}, false)
        this.loading = false;
        this.alertMsg('s','保存意图信息成功！')

        this.$store.commit({
          type:'EDIT_INTENTION',
          seqId,
          ...temp
        })
      }
    },
    uploadSuccess(data) {
      this.form.fileName = data.fileName
      this.form.filePath = data.filePath
      this.alertMsg('s','上传音频成功（记得点击保存）！）')
    },
    onIntentionDetail(seqId) {
      this.editIntention = true
      const target = this.intention.filter((item)=>{
        return item.seqId == seqId
      })[0]
      this.intentionDetail = {
        seqId,
        twistName:target.twistName,
        keyWord:target.keyWord,
        nextProcessId:target.nextProcessId,
        isEdited:true
      }
      this.dialogFormVisible=true
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
    async initFlowList() {
      const flowList = ( await ajax('POST','queryTermProcess',{termId:this.$route.params.seqId}) ).data
      this.$store.commit({
        type: 'SET_FLOW_LIST',
        flowList
      })

      console.log('flowList',flowList)
      if (flowList.length > 0) {
        console.log('sdjkfhsadjfkh ')
        this.nodeSelected = {...flowList[0]}
        // this.nodeIdSelected = flowList[0].seqId
        this.radio = flowList[0].seqId
        this.selectNode(flowList[0].seqId)
      } else {
        this.alertMsg('e')
      }

    }
  }
}
</script>
